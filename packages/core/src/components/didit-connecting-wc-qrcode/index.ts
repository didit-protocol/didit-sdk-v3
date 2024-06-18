import { customElement } from '@web3modal/ui'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { EventsController } from '../../controllers/Events.js'
import { ConnectionController } from '../../controllers/Connection.js'

@customElement('didit-connecting-wc-qrcode')
export class DiditConnectingWcQrcode extends DiditWeb3Connecting {
  public static override styles = styles

  public constructor() {
    super()
    window.addEventListener('resize', this.forceUpdate)
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet?.name ?? 'WalletConnect', platform: 'qrcode' }
    })
  }

  public override disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('resize', this.forceUpdate)
  }

  // -- Render -------------------------------------------- //
  public override render() {
    this.onRenderProxy()

    return html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${['0', 'xl', 'xl', 'xl']}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>

      <didit-mobile-download-links .wallet=${this.wallet}></didit-mobile-download-links>
    `
  }

  // -- Private ------------------------------------------- //
  private onRenderProxy() {
    if (!this.ready && this.uri) {
      this.timeout = setTimeout(() => {
        this.ready = true
      }, 200)
    }
  }

  private qrCodeTemplate() {
    if (!this.uri || !this.ready) {
      return null
    }

    const size = this.getBoundingClientRect().width - 40
    const alt = this.wallet ? this.wallet.name : undefined
    ConnectionController.setWcLinking(undefined)
    // ConnectionController.setRecentWallet(this.wallet)

    // ThemeController.state.themeMode --> 'dark'
    return html` <wui-qr-code
      size=${size}
      theme=${'dark'}
      uri=${this.uri}
      imageSrc=${this.wallet?.image_url}
      alt=${ifDefined(alt)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`
  }

  private copyTemplate() {
    const inactive = !this.uri || !this.ready

    return html`<wui-link
      .disabled=${inactive}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`
  }

  private forceUpdate = () => {
    this.requestUpdate()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-qrcode': DiditConnectingWcQrcode
  }
}
