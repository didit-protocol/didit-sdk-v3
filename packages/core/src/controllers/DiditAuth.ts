import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, ref, subscribe as sub } from 'valtio/vanilla'

import type {
  DiditSession,
  DiditTokenAuthorization,
  SIWECreateMessageArgs,
  SIWEVerifyMessageArgs,
  SocialConnectorType
  // SocialConnectorType
} from '../types'
import { StorageUtil } from '../utils'

interface DiditAuthClientMethods {
  // Wallet methods
  getNonce: (address?: string) => Promise<{ policy: string; code: string }>
  createMessage: (args: SIWECreateMessageArgs) => string
  verifyMessage: (args: SIWEVerifyMessageArgs) => Promise<DiditTokenAuthorization | false>

  // Social methods
  verifySocialOAuthCode: (code: string) => Promise<DiditTokenAuthorization>

  // Session methods
  getSession: (accessToken?: string) => Promise<DiditSession | null>
  signOut: () => Promise<boolean>
  // Callbacks
  onSignIn?: (session: DiditSession) => void
  onSignOut?: () => void
  onError?: (error?: unknown) => void
}

export interface DiditAuthControllerClient extends DiditAuthClientMethods {
  web3SignIn: () => Promise<DiditSession>
  socialSignIn: (code: string) => Promise<DiditSession>
}

export interface DiditAuthControllerClientState {
  _client?: DiditAuthControllerClient
  nonce?: { policy: string; code: string }
  session?: DiditSession
  message?: string
  status: 'ready' | 'loading' | 'success' | 'rejected' | 'error'
  codeVerifier?: string
  socialProvider?: SocialConnectorType
  popupWindow?: Window | null
}

type StateKey = keyof DiditAuthControllerClientState

// -- State --------------------------------------------- //
const state = proxy<DiditAuthControllerClientState>({
  status: 'ready',
  popupWindow: null
})

// -- Controller ---------------------------------------- //
export const DiditAuthController = {
  state,

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: DiditAuthControllerClientState[K]) => void
  ) {
    return subKey(state, key, callback)
  },

  subscribe(callback: (newState: DiditAuthControllerClientState) => void) {
    return sub(state, () => callback(state))
  },

  _getClient() {
    if (!state._client) {
      throw new Error('DiditController client not set')
    }

    return state._client
  },

  setClient(client: DiditAuthControllerClient) {
    state._client = ref(client)
  },

  async getNonce(address?: string) {
    const client = this._getClient()
    const nonce = await client.getNonce(address)
    this.setNonce(nonce)

    return nonce
  },

  async getSession() {
    try {
      const client = this._getClient()
      const tokens = StorageUtil.getDiditAuthTokens()
      const session = await client.getSession(tokens?.access_token)
      if (session) {
        this.setSession(session)
        this.setStatus('success')
      }

      return session
    } catch {
      return undefined
    }
  },

  createMessage(args: SIWECreateMessageArgs) {
    const client = this._getClient()
    const message = client.createMessage(args)
    this.setMessage(message)

    return message
  },

  async verifyMessage(args: SIWEVerifyMessageArgs) {
    const client = this._getClient()
    const tokens = await client.verifyMessage(args)

    return tokens
  },

  async web3SignIn() {
    const client = this._getClient()
    const session = await client.web3SignIn()

    return session
  },

  async socialSignIn(code: string) {
    const client = this._getClient()

    return await client.socialSignIn(code)
  },

  async verifySocialOAuthCode(code: string) {
    const client = this._getClient()
    const session = await client.verifySocialOAuthCode(code)

    return session
  },

  async signOut() {
    const client = this._getClient()
    await client.signOut()
    this.setStatus('ready')
    this.setSession(undefined)
    client.onSignOut?.()
  },

  onSignIn(args: DiditSession) {
    const client = this._getClient()
    client.onSignIn?.(args)
  },

  onSignOut() {
    const client = this._getClient()
    client.onSignOut?.()
  },

  onError(error: unknown) {
    const client = this._getClient()
    client.onError?.(error)
  },

  setDiditClient(client: DiditAuthControllerClient) {
    state._client = ref(client)
  },

  setNonce(nonce: DiditAuthControllerClientState['nonce']) {
    state.nonce = nonce
  },

  setStatus(status: DiditAuthControllerClientState['status']) {
    state.status = status
  },

  setMessage(message: DiditAuthControllerClientState['message']) {
    state.message = message
  },

  setSession(session: DiditAuthControllerClientState['session']) {
    state.session = session
    state.status = session ? 'success' : 'ready'
  },

  setCodeVerifier(codeVerifier: DiditAuthControllerClientState['codeVerifier']) {
    if (codeVerifier) {
      StorageUtil.setSocialCodeVerifier(codeVerifier)
    }
    state.codeVerifier = codeVerifier
  },

  getCodeVerifier() {
    const codeVerifier = StorageUtil.getSocialCodeVerifier()

    return codeVerifier ?? state.codeVerifier
  },

  setPopup(popupWindow: DiditAuthControllerClientState['popupWindow']) {
    if (popupWindow) {
      state.popupWindow = ref(popupWindow)
    }
  },

  setSocialProvider(provider: DiditAuthControllerClientState['socialProvider']) {
    if (provider) {
      StorageUtil.setConnectedSocialProvider(provider)
    }
    state.socialProvider = provider
  },

  resetSocialData() {
    state.codeVerifier = undefined
    state.popupWindow?.close()
    state.popupWindow = null
    state.status = 'ready'
    StorageUtil.deleteConnectedSocialProvider()
    StorageUtil.deleteSocialCodeVerifier()
  }
}
