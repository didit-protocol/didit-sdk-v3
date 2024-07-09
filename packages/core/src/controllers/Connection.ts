import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, ref } from 'valtio/vanilla'
import { CoreHelperUtil } from '../utils/CoreHelperUtil.js'
import type { SocialConnectorType, Web3Connector } from '../types/index.js'
import { AccountController } from './Account.js'
import { StorageUtil } from '../utils/StorageUtil.js'

// -- Types --------------------------------------------- //
export interface ConnectExternalOptions {
  id: Web3Connector['id']
  type: Web3Connector['type']
  provider?: Web3Connector['provider']
  info?: Web3Connector['info']
}

export interface ConnectionControllerClient {
  disconnect: () => Promise<void>
  connectSocialProvider: (provider: SocialConnectorType) => {
    codeVerifier: string
    popupWindow: Window | null
  }
  // Web3Wallets
  connectWalletConnect: (onUri: (uri: string) => void) => Promise<void>
  connectExternal?: (options: ConnectExternalOptions) => Promise<void>
  reconnectExternal?: (options: ConnectExternalOptions) => Promise<void>
  checkInstalled?: (ids?: string[]) => boolean
  signMessage: (message: string) => Promise<string>
  switchNetwork: (networkId: number) => Promise<void>
}

export interface ConnectionControllerState {
  _client?: ConnectionControllerClient
  wcUri?: string
  wcPromise?: Promise<void>
  wcPairingExpiry?: number
  wcLinking?: {
    href: string
    name: string
  }
  wcError?: boolean
  buffering: boolean
  recentWallet?: {
    id: string
    name: string
    imageUrl: string
  }
}

type StateKey = keyof ConnectionControllerState

// -- State --------------------------------------------- //
const state = proxy<ConnectionControllerState>({
  wcError: false,
  buffering: false
})

// -- Controller ---------------------------------------- //
export const ConnectionController = {
  state,

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: ConnectionControllerState[K]) => void
  ) {
    return subKey(state, key, callback)
  },

  _getClient() {
    if (!state._client) {
      throw new Error('ConnectionController client not set')
    }

    return state._client
  },

  setClient(client: ConnectionControllerClient) {
    state._client = ref(client)
  },

  connectSocialProvider(provider: SocialConnectorType) {
    return this._getClient().connectSocialProvider(provider)
  },

  connectWalletConnect() {
    state.wcPromise = this._getClient().connectWalletConnect(uri => {
      state.wcUri = uri
      state.wcPairingExpiry = CoreHelperUtil.getPairingExpiry()
    })
  },

  async connectExternal(options: ConnectExternalOptions) {
    await this._getClient().connectExternal?.(options)
  },

  async reconnectExternal(options: ConnectExternalOptions) {
    await this._getClient().reconnectExternal?.(options)
  },

  async signMessage(message: string) {
    return this._getClient().signMessage(message)
  },

  checkInstalled(ids?: string[]) {
    return this._getClient().checkInstalled?.(ids)
  },

  resetWcConnection() {
    state.wcUri = undefined
    state.wcPairingExpiry = undefined
    state.wcPromise = undefined
    state.wcLinking = undefined
  },

  setWcLinking(wcLinking: ConnectionControllerState['wcLinking']) {
    state.wcLinking = wcLinking
  },

  setWcError(wcError: ConnectionControllerState['wcError']) {
    state.wcError = wcError
    state.buffering = false
  },

  setRecentWallet(wallet: ConnectionControllerState['recentWallet']) {
    if (wallet) {
      StorageUtil.setRecentWallet(wallet)
    }
    state.recentWallet = wallet
  },

  getRecentWallet() {
    return state.recentWallet || StorageUtil.getRecentWallet()
  },

  setBuffering(buffering: ConnectionControllerState['buffering']) {
    state.buffering = buffering
  },

  async disconnect() {
    await this._getClient().disconnect()
    AccountController.resetAccount()
    this.resetWcConnection()
  }
}
