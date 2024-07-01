import { customElement } from '@didit-sdk/ui'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { ConnectionController, EventsController, ModalController } from '../../controllers/index.js'
import { ConnectorController } from '../../controllers/Connectors.js'
import { CoreHelperUtil } from '../../utils/index.js'
import type { BaseError } from '../../types/index.js'

@customElement('didit-connecting-wc-browser')
export class DiditConnectingWcBrowser extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-browser: No wallet provided')
    }
    this.onConnect = this.onConnectProxy.bind(this)
    this.onAutoConnect = this.onConnectProxy.bind(this)
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet.name, platform: 'browser' }
    })
  }

  // -- Private ------------------------------------------- //
  private async onConnectProxy() {
    try {
      this.error = false
      const { connectors } = ConnectorController.state
      const announcedConnector = connectors
        .filter(CoreHelperUtil.isWeb3Connector)
        .find(c => c.type === 'ANNOUNCED' && c.info?.rdns === this.wallet?.rdns)
      const injectedConnector = connectors
        .filter(CoreHelperUtil.isWeb3Connector)
        .find(c => c.type === 'INJECTED')
      if (announcedConnector) {
        await ConnectionController.connectExternal(announcedConnector)
      } else if (injectedConnector) {
        await ConnectionController.connectExternal(injectedConnector)
      }
      ModalController.close()

      EventsController.sendEvent({
        type: 'track',
        event: 'CONNECT_SUCCESS',
        properties: { method: 'browser', name: this.wallet?.name || 'Unknown' }
      })
    } catch (error) {
      EventsController.sendEvent({
        type: 'track',
        event: 'CONNECT_ERROR',
        properties: { message: (error as BaseError)?.message ?? 'Unknown' }
      })
      this.error = true
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-browser': DiditConnectingWcBrowser
  }
}
