import { customElement } from '@web3modal/ui'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { EventsController } from '../../controllers/Events.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { ConnectionController } from '../../controllers/Connection.js'

@customElement('didit-connecting-wc-web')
export class DiditConnectingWcWeb extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-web: No wallet provided')
    }
    this.onConnect = this.onConnectProxy.bind(this)
    this.secondaryBtnLabel = 'Open'
    this.secondaryLabel = 'Open and continue in a new browser tab'
    this.secondaryBtnIcon = 'externalLink'
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet.name, platform: 'web' }
    })
  }

  // -- Private ------------------------------------------- //
  private onConnectProxy() {
    if (this.wallet?.webapp_link && this.uri) {
      try {
        this.error = false
        const { webapp_link, name } = this.wallet
        const { redirect, href } = CoreHelperUtil.formatUniversalUrl(webapp_link, this.uri)
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
    'didit-connecting-wc-web': DiditConnectingWcWeb
  }
}
