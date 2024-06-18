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
const grantType = ConstantsUtil.DIDIT_WALLET_GRANNT_TYPE

// -- Types --------------------------------------------- //
export interface DiditApiControllerState {
  api: FetchUtil | null
  authBaseUrl: string
  walletAuthorizationPath: string
  tokenAuthorizationPath: string
  redirectUri?: string
  isAnalyticsEnabled: boolean
}

type StateKey = keyof DiditApiControllerState

// -- State --------------------------------------------- //
const state = proxy<DiditApiControllerState>({
  api: null,
  authBaseUrl: ConstantsUtil.DIDIT_BASE_AUTH_URL,
  walletAuthorizationPath: ConstantsUtil.DIDIT_WALLET_AUTH_PATH,
  tokenAuthorizationPath: ConstantsUtil.DIDIT_WALLET_TOKEN_PATH,
  redirectUri: ConstantsUtil.DIDIT_AUTH_REDIRECT_URL,
  isAnalyticsEnabled: false
})

// -- Controller ---------------------------------------- //
export const DiditApiController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: DiditApiControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  initializeApi() {
    const { authBaseUrl } = state
    state.api = new FetchUtil({ baseUrl: authBaseUrl })
  },

  setAuthBaseUrl(baseUrl: string) {
    state.authBaseUrl = baseUrl
    state.api = new FetchUtil({ baseUrl })
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
      grant_type: grantType,
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
    const response = await state.api?.postWithBaseUrl<DiditTokenInfo>(
      ConstantsUtil.DIDIT_BASE_AUTH_URL,
      {
        path: ConstantsUtil.DIDIT_INTROSPECT_PATH,
        headers
      }
    )

    return response
  },

  genetateProviderAuthUrl(
    provider: SocialConnectorType,
    codeVerifier: string,
    codeChallenge: string
  ) {
    const { clientId, claims, scope } = ConfigurationController.state
    /*
     * Configure the Didit auth popup
     * const authorizationUrl = `${ConstantsUtil.DIDIT_BASE_AUTH_URL}${ConstantsUtil.DIDIT_EMAIL_AUTH_PATH}`
     */
    const authorizationUrl = new URL(
      ConstantsUtil.DIDIT_EMAIL_AUTH_PATH,
      ConstantsUtil.DIDIT_BASE_AUTH_URL
    )

    const codeChallengeMethod = ConstantsUtil.DIDIT_EMAIL_CODE_CHALLENGE_METHOD
    const responseType = ConstantsUtil.DIDIT_EMAIL_RESPONSE_TYPE
    const params = {
      claims,
      client_id: clientId,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      code_verifier: codeVerifier,
      idp: provider,
      redirect_uri: state.redirectUri,
      response_type: responseType,
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

  async verifySocialOAuthCode(code: string, codeVerifier: string) {
    const { clientId } = ConfigurationController.state
    const tokenBody = new URLSearchParams()
    tokenBody.append('client_id', clientId)
    tokenBody.append('code', code)
    tokenBody.append('code_verifier', codeVerifier)
    tokenBody.append('grant_type', ConstantsUtil.DIDIT_EMAIL_GRANNT_TYPE)
    tokenBody.append('redirect_uri', state.redirectUri || '')

    const response = await state.api?.postWithBaseUrl(ConstantsUtil.DIDIT_BASE_AUTH_URL, {
      path: ConstantsUtil.DIDIT_EMAIL_TOKEN_PATH,
      body: tokenBody
    })

    return response as DiditTokenAuthorization
  }
}
