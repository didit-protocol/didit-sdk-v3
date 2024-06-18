import { customElement } from '@web3modal/ui'
import { DiditWeb3Connecting } from '../../components/didit-web3-connecting'
import { ConnectionController, EventsController, RouterController } from '../../controllers'
import { CoreHelperUtil } from '../../utils'
import type { BaseError } from '../../types'

@customElement('didit-connecting-wallet-view')
export class DiditConnectingWalletView extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.connector) {
      throw new Error('w3m-connecting-view: No connector provided')
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
    this.isWalletConnect = false
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

        // TODOX: go to the SIWE page
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
