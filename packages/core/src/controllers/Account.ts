import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, subscribe as sub } from 'valtio/vanilla'
import type { DiditAuthType, DiditSession, DiditTokenAuthorization, Web3Network } from '../types'
import { ConstantsUtil, StorageUtil } from '../utils'
import { DiditApiController } from './DiditApi'

// -- Types --------------------------------------------- //
export interface AccountControllerState {
  // Didit auth
  isAuthenticated?: boolean
  diditSession?: DiditSession
  accessToken?: string
  refreshToken?: string
  authMethod?: DiditAuthType
  // Wallet
  isWalletConnected?: boolean
  walletAddress?: string
  addressExplorerUrl?: string
  network?: Web3Network
  requestedNetworks: Web3Network[]

  timeout?: NodeJS.Timeout
}

type StateKey = keyof AccountControllerState

// -- State --------------------------------------------- //
const state = proxy<AccountControllerState>({
  isAuthenticated: undefined,
  isWalletConnected: undefined,
  requestedNetworks: []
})

// -- Controller ---------------------------------------- //
export const AccountController = {
  state,

  subscribe(callback: (newState: AccountControllerState) => void) {
    return sub(state, () => callback(state))
  },

  subscribeKey<K extends StateKey>(key: K, callback: (value: AccountControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  setIsAuthenticated(isAuthenticated: AccountControllerState['isAuthenticated']) {
    state.isAuthenticated = isAuthenticated
  },

  setDiditSession(diditSession: AccountControllerState['diditSession']) {
    if (diditSession) {
      StorageUtil.setDiditAuthSession(diditSession)
    }
    let authType: DiditAuthType = 'wallet'
    if (diditSession?.identifierType !== 'wallet_address') {
      const getAuthMethod = StorageUtil.getConnectedSocialProvider()
      if (getAuthMethod) {
        authType = getAuthMethod
      }
    }
    this.state.authMethod = authType
    state.diditSession = diditSession
    clearTimeout(state.timeout)
    if (diditSession) {
      this._schuduleTokenRefresh(diditSession.exp)
    }
  },

  _schuduleTokenRefresh(exp: number) {
    // Current time in seconds
    const currentTime = Math.floor(Date.now() / 1000)
    // Time until token expiration in seconds
    const timeUntilExpiration = exp - currentTime
    const refreshMargin = ConstantsUtil.FIVE_MINUTES_S
    // 5 minutes
    const timeout = (timeUntilExpiration - refreshMargin) * ConstantsUtil.ONE_SEC_MS
    if (timeout > 0) {
      const refreshDateTime = new Date(Date.now() + timeout)
      console.info(refreshDateTime.toString())
      state.timeout = setTimeout(() => this._refreshSessionBeforeExpiration(), timeout)
    }
  },

  async _refreshSessionBeforeExpiration() {
    if (!state.refreshToken) {
      return
    }
    try {
      const newTokens = await DiditApiController.refreshTokens(state.refreshToken)
      if (newTokens) {
        this.setDiditTokens(newTokens)
        const session = await DiditApiController.introspectToken(newTokens.access_token)
        if (session?.active) {
          this.setDiditSession({
            id: session.sub,
            identifier: session.identifier,
            identifierType: session.identifier_type,
            claims: session.claims,
            exp: session.exp
          })
        }
      }
    } catch (error) {
      console.warn('Error refreshing token', error)
    }
  },

  setAuthMethod(authMethod: AccountControllerState['authMethod']) {
    if (authMethod) {
      StorageUtil.setDiditAuthMethod(authMethod)
    }
    state.authMethod = authMethod
  },

  setDiditTokens(tokens: DiditTokenAuthorization) {
    StorageUtil.setDiditAuthTokens(tokens)
    state.accessToken = tokens.access_token
    state.refreshToken = tokens.refresh_token
  },

  setWalletConnected(isWalletConnected: AccountControllerState['isWalletConnected']) {
    state.isWalletConnected = isWalletConnected
  },

  setWalletAddress(walletAddress: AccountControllerState['walletAddress']) {
    state.walletAddress = walletAddress
  },

  setAddressExplorerUrl(addressExplorerUrl: AccountControllerState['addressExplorerUrl']) {
    state.addressExplorerUrl = addressExplorerUrl
  },

  setNetwork(network: AccountControllerState['network']) {
    state.network = network
  },

  setRequestedNetworks(requestedNetworks: AccountControllerState['requestedNetworks']) {
    state.requestedNetworks = requestedNetworks
  },

  syncDiditTokens() {
    const tokens = StorageUtil.getDiditAuthTokens()
    if (tokens) {
      state.accessToken = tokens.access_token
      state.refreshToken = tokens.refresh_token
    }
  },

  resetDiditSession() {
    state.isAuthenticated = false
    state.diditSession = undefined
    state.accessToken = undefined
    state.refreshToken = undefined
    StorageUtil.deleteDiditAuthSession()
    StorageUtil.deleteDiditAuthTokens()
  },

  resetAccount() {
    state.walletAddress = ''
    state.isWalletConnected = false
    state.addressExplorerUrl = ''
  },

  resetNetwork() {
    state.network = undefined
    state.requestedNetworks = []
  }
}
