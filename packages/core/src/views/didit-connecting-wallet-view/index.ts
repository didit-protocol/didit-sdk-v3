import { customElement } from '@didit-sdk/ui'
import { DiditWeb3Connecting } from '../../components/didit-web3-connecting/index.js'
import {
  ConnectionController,
  DiditApiController,
  EventsController,
  RouterController
} from '../../controllers/index.js'
import { CoreHelperUtil } from '../../utils/index.js'
import type { BaseError } from '../../types/index.js'

@customElement('didit-connecting-wallet-view')
export class DiditConnectingWalletView extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.connector) {
      throw new Error('didit-connecting-view: No connector provided')
    }

    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: {
        name: this.connector.name ?? 'Unknown',
        platform: 'browser'
      }
    })
    this.onConnect = this.onConnectProxy.bind(this)
    this.onAutoConnect = this.onConnectProxy.bind(this)
  }

  // -- Private ------------------------------------------- //
  private async onConnectProxy() {
    try {
      this.error = false
      if (this.connector) {
        // If connector is not a web3 connector, something is wrong
        if (!CoreHelperUtil.isWeb3Connector(this.connector)) {
          return
        }
        await ConnectionController.connectExternal(this.connector)
        const imageUrl = DiditApiController.getConnectorImageUrl(this.connector.imageId || '')
        ConnectionController.setRecentWallet({
          id: this.connector.id,
          name: this.connector.name || 'Enjected',
          imageUrl: this.connector.imageUrl ?? imageUrl
        })

        RouterController.push('ConnectingDiditSiwe')

        EventsController.sendEvent({
          type: 'track',
          event: 'CONNECT_SUCCESS',
          properties: { method: 'browser', name: this.connector.name || 'Unknown' }
        })
      }
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
    'didit-connecting-wallet-view': DiditConnectingWalletView
  }
}
