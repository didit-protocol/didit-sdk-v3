import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy } from 'valtio/vanilla'
import { FetchUtil } from '../utils/FetchUtil.js'
import { ConstantsUtil } from '../utils/ConstantsUtil.js'
import { ConfigurationController } from './Configuration.js'
import type {
  DiditWalletAuthorization,
  DiditTokenAuthorization,
  DiditTokenInfo
} from '../types/didit.js'
import type { SocialConnectorType } from '../types/socials.js'

// -- Helpers ------------------------------------------- //
const diditAuthBaseUrl = ConstantsUtil.DIDIT_BASE_AUTH_URL
const diditAuthStagingBaseUrl = ConstantsUtil.DIDIT_STAGING_BASE_AUTH_URL
const diditWalletAuthPath = ConstantsUtil.DIDIT_WALLET_AUTH_PATH
const diditWalletTokenPath = ConstantsUtil.DIDIT_WALLET_TOKEN_PATH
const diditAuthRedirectUrl = ConstantsUtil.DIDIT_AUTH_REDIRECT_URL
const walletGrantType = ConstantsUtil.DIDIT_WALLET_GRANNT_TYPE
const refreshGrantType = ConstantsUtil.DIDIT_REFRESH_GRANT_TYPE
const introspectPath = ConstantsUtil.DIDIT_INTROSPECT_PATH
const refreshTokenPath = ConstantsUtil.DIDIT_WALLET_TOKEN_PATH
const emailAuthPath = ConstantsUtil.DIDIT_EMAIL_AUTH_PATH
const emailTokenPath = ConstantsUtil.DIDIT_EMAIL_TOKEN_PATH
const emailLogoutPath = ConstantsUtil.DIDIT_EMAIL_LOGOUT_PATH
const emailCodeChallengeMethod = ConstantsUtil.DIDIT_EMAIL_CODE_CHALLENGE_METHOD
const emailResponseType = ConstantsUtil.DIDIT_EMAIL_RESPONSE_TYPE
const emailGrantType = ConstantsUtil.DIDIT_EMAIL_GRANNT_TYPE
const wcAssetsWalletLogoPath = ConstantsUtil.WC_ASSETS_API_WALLET_LOGO_PATH
const wcAssetsApiUrl = ConstantsUtil.WC_ASSETS_API_URL

// -- Types --------------------------------------------- //
export interface DiditApiControllerState {
  api: FetchUtil | null
  walletAuthBaseUrl: string
  walletAuthorizationPath: string
  tokenAuthorizationPath: string
  redirectUri?: string
  isAnalyticsEnabled?: boolean
  isStaging?: boolean
}

type StateKey = keyof DiditApiControllerState

// -- State --------------------------------------------- //
const state = proxy<DiditApiControllerState>({
  api: null,
  walletAuthBaseUrl: diditAuthBaseUrl,
  walletAuthorizationPath: diditWalletAuthPath,
  tokenAuthorizationPath: diditWalletTokenPath,
  redirectUri: diditAuthRedirectUrl,
  isAnalyticsEnabled: false,
  isStaging: false
})

// -- Controller ---------------------------------------- //
export const DiditApiController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: DiditApiControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  initializeApi() {
    const { walletAuthBaseUrl } = state
    state.api = new FetchUtil({ baseUrl: walletAuthBaseUrl })
  },

  setAuthBaseUrl(baseUrl?: string) {
    if (baseUrl) {
      state.walletAuthBaseUrl = baseUrl
      this._initializeApi(baseUrl)
    } else {
      const baseUri = state.isStaging ? diditAuthStagingBaseUrl : diditAuthBaseUrl
      state.walletAuthBaseUrl = baseUri
      this._initializeApi(baseUri)
    }
  },

  setWalletAuthorizationPath(walletAuthorizationPath: string) {
    state.walletAuthorizationPath = walletAuthorizationPath
  },

  setTokenAuthorizationPath(tokenAuthorizationPath: string) {
    state.tokenAuthorizationPath = tokenAuthorizationPath
  },

  setRedirectUri(redirectUri: string) {
    state.redirectUri = redirectUri
  },

  setAnalyticsEnabled(isEnabled: boolean) {
    state.isAnalyticsEnabled = isEnabled
  },

  setStaging(isStaging: boolean) {
    state.isStaging = isStaging
  },

  _initializeApi(baseUrl: string) {
    state.api = new FetchUtil({ baseUrl })
  },

  _getWalletAuthHeader() {
    const { clientId, clientSecret } = ConfigurationController.state
    const headers: Record<string, string> = {}
    if (clientSecret) {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      headers['Authorization'] = `Basic ${auth}`
    }
    headers['Content-Type'] = 'application/json'

    return headers
  },

  async walletAuthorization(walletAddress: string) {
    const { walletAuthorizationPath } = state
    const { claims, scope } = ConfigurationController.state
    const headers = DiditApiController._getWalletAuthHeader()
    const data = {
      wallet_address: walletAddress,
      scope,
      claims
    }
    const response = await state.api?.post<DiditWalletAuthorization>({
      path: walletAuthorizationPath,
      headers,
      body: data
    })

    return response
  },

  async tokenAuthorization(code: string, walletSignature: string) {
    const { tokenAuthorizationPath } = state
    const headers = DiditApiController._getWalletAuthHeader()
    const data = {
      code,
      grant_type: walletGrantType,
      wallet_signature: walletSignature
    }
    const response = await state.api?.post<DiditTokenAuthorization>({
      path: tokenAuthorizationPath,
      headers,
      body: data
    })

    return response
  },

  async introspectToken(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    /*
     * Introspect token should call didit api directly this.baseAuthUrl is
     * override by the user to implement custom auth endpoints
     */
    const response = await state.api?.postWithBaseUrl<DiditTokenInfo>(diditAuthBaseUrl, {
      path: introspectPath,
      headers
    })

    return response
  },

  async refreshTokens(refreshToken: string) {
    const { clientId } = ConfigurationController.state
    const headers = DiditApiController._getWalletAuthHeader()
    const data = {
      client_id: clientId,
      grant_type: refreshGrantType,
      refresh_token: refreshToken
    }
    const response = await state.api?.postWithBaseUrl<DiditTokenAuthorization>(diditAuthBaseUrl, {
      path: refreshTokenPath,
      body: data,
      headers
    })

    return response
  },

  async verifySocialOAuthCode(code: string, codeVerifier: string) {
    const { clientId } = ConfigurationController.state
    const tokenBody = new URLSearchParams()
    tokenBody.append('client_id', clientId)
    tokenBody.append('code', code)
    tokenBody.append('code_verifier', codeVerifier)
    tokenBody.append('grant_type', emailGrantType)
    tokenBody.append('redirect_uri', state.redirectUri || '')

    const response = await state.api?.postWithBaseUrl<DiditTokenAuthorization>(diditAuthBaseUrl, {
      path: emailTokenPath,
      body: tokenBody
    })

    return response
  },

  async logoutSocialProvider(accessToken: string) {
    const res = await state.api?.getWithBaseUrl<null>(diditAuthBaseUrl, {
      path: emailLogoutPath,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return res
  },

  genetateProviderAuthUrl(
    provider: SocialConnectorType,
    codeVerifier: string,
    codeChallenge: string
  ) {
    const { clientId, claims, scope } = ConfigurationController.state
    const authorizationUrl = new URL(emailAuthPath, diditAuthBaseUrl)

    const params = {
      claims,
      client_id: clientId,
      code_challenge: codeChallenge,
      code_challenge_method: emailCodeChallengeMethod,
      code_verifier: codeVerifier,
      idp: provider,
      redirect_uri: state.redirectUri,
      response_type: emailResponseType,
      scope
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        authorizationUrl.searchParams.append(key, value)
      }
    })

    // Generate the authorization url
    return authorizationUrl.toString()
  },

  getConnectorImageUrl(id: string) {
    const projectId = ConfigurationController.state.projectId
    const url = new URL(wcAssetsWalletLogoPath + id, wcAssetsApiUrl)
    url.searchParams.append('projectId', projectId)

    return url.toString()
  }
}
