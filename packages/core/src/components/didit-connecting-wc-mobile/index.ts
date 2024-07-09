import { customElement } from '@didit-sdk/ui'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { ConnectionController, EventsController } from '../../controllers/index.js'
import { CoreHelperUtil } from '../../utils/index.js'

@customElement('didit-connecting-wc-mobile')
export class DiditConnectingWcMobile extends DiditWeb3Connecting {
  public constructor() {
    super()
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-mobile: No wallet provided')
    }
    this.onConnect = this.onConnectProxy.bind(this)
    this.onRender = this.onRenderProxy.bind(this)
    document.addEventListener('visibilitychange', this.onBuffering.bind(this))
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet.name, platform: 'mobile' }
    })
  }

  public override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('visibilitychange', this.onBuffering.bind(this))
  }

  // -- Private ------------------------------------------- //
  private onRenderProxy() {
    if (!this.ready && this.uri) {
      this.ready = true
      this.onConnect?.()
    }
  }

  private onConnectProxy() {
    if (this.wallet?.mobile_link && this.uri) {
      try {
        this.error = false
        const { mobile_link, name } = this.wallet
        const { redirect, href } = CoreHelperUtil.formatNativeUrl(mobile_link, this.uri)
        ConnectionController.setWcLinking({ name, href })
        ConnectionController.setRecentWallet({
          id: this.wallet.id,
          name: this.wallet.name,
          imageUrl: this.wallet.image_url ?? ''
        })
        CoreHelperUtil.openHref(redirect, '_self')
      } catch {
        this.error = true
      }
    }
  }

  private onBuffering() {
    const isIos = CoreHelperUtil.isIos()
    if (document?.visibilityState === 'visible' && !this.error && isIos) {
      ConnectionController.setBuffering(true)
      setTimeout(() => {
        ConnectionController.setBuffering(false)
      }, 5000)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-mobile': DiditConnectingWcMobile
  }
}
