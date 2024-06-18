import { customElement } from '@web3modal/ui'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { EventsController } from '../../controllers/Events.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { ConnectionController } from '../../controllers/Connection.js'

@customElement('didit-connecting-wc-desktop')
export class DiditConnectingWcDesktop extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-desktop: No wallet provided')
    }
    this.onConnect = this.onConnectProxy.bind(this)
    this.onRender = this.onRenderProxy.bind(this)
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet.name, platform: 'desktop' }
    })
  }

  // -- Private ------------------------------------------- //
  private onRenderProxy() {
    if (!this.ready && this.uri) {
      this.ready = true
      this.timeout = setTimeout(() => {
        this.onConnect?.()
      }, 200)
    }
  }

  private onConnectProxy() {
    if (this.wallet?.desktop_link && this.uri) {
      try {
        this.error = false
        const { desktop_link, name } = this.wallet
        const { redirect, href } = CoreHelperUtil.formatNativeUrl(desktop_link, this.uri)
        ConnectionController.setWcLinking({ name, href })
        // ConnectionController.setRecentWallet(this.wallet)
        CoreHelperUtil.openHref(redirect, '_blank')
      } catch {
        this.error = true
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-desktop': DiditConnectingWcDesktop
  }
}
