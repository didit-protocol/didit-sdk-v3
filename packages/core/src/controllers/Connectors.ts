import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, ref } from 'valtio/vanilla'
import type { Connector, WcWallet } from '../types'
import { CoreHelperUtil } from '../utils'
import { ConfigurationController } from './Configuration'

// -- Types --------------------------------------------- //
export interface ConnectorControllerState {
  connectors: Connector[]
  wcWallets: WcWallet[]
}

type StateKey = keyof ConnectorControllerState

// -- State --------------------------------------------- //
const state = proxy<ConnectorControllerState>({
  connectors: [],
  wcWallets: []
})

// -- Controller ---------------------------------------- //
export const ConnectorController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: ConnectorControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  setConnectors(connectors: ConnectorControllerState['connectors']) {
    state.connectors = connectors.map(c => ref(c))
  },

  setWcWallets(wcWallets: ConnectorControllerState['wcWallets']) {
    state.wcWallets = wcWallets
  },

  addConnector(connector: Connector) {
    state.connectors.push(ref(connector))
  },

  getAnnouncedConnectorRdns() {
    return state.connectors
      .filter(CoreHelperUtil.isWeb3Connector)
      .filter(c => c.type === 'ANNOUNCED')
      .map(c => c.info?.rdns)
  },

  getConnectors() {
    return state.connectors
  },

  getWcWallets() {
    return state.wcWallets
  },

  getConnector(id: string, rdns?: string | null) {
    return state.connectors
      .filter(CoreHelperUtil.isWeb3Connector)
      .find(c => c.explorerId === id || c.info?.rdns === rdns)
  },

  getConnectorImageUrl(id: string) {
    const projectId = ConfigurationController.state.projectId

    // TODOX: move api to api Controller
    return `https://explorer-api.walletconnect.com/v3/logo/sm/${id}?projectId=${projectId}`
  }
}
