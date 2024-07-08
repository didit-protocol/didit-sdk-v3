import { customElement } from '@didit-sdk/ui'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'
import { DiditWeb3Connecting } from '../didit-web3-connecting/index.js'
import { EventsController } from '../../controllers/Events.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { ConnectorController } from '../../controllers/Connectors.js'
import { ConstantsUtil } from '../../utils/ConstantsUtil.js'
import { DiditApiController } from '../../controllers/DiditApi.js'

@customElement('didit-connecting-wc-qrcode')
export class DiditConnectingWcQrcode extends DiditWeb3Connecting {
  public static override styles = styles

  // -- Properties and States ---------------------------------------- //

  @property({ type: Boolean }) public walletConnect = false

  public constructor() {
    super()
    window.addEventListener('resize', this.forceUpdate)
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: {
        name: this.wallet?.name ?? 'WalletConnect',
        platform: 'qrcode'
      }
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
      <ui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${['xxl', 'xl', 'xxl', 'xl']}
        gap="xl"
      >
        <ui-text variant="paragraph-1" color="surface-md">
          Scan this QR Code with your phone
        </ui-text>

        <div class="qr-code-container">${this.qrCodeTemplate()}</div>
      </ui-flex>

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
    ConnectionController.setRecentWallet({
      id: this.wallet?.id ?? ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID,
      name: this.wallet?.name ?? 'WalletConnect',
      imageUrl: this.wallet?.image_url ?? ''
    })

    const imageSrc = this.walletConnect ? this.getWalletConnectImageUrl() : this.wallet?.image_url

    return html`
      <ui-qr-code
        size=${size}
        uri=${this.uri}
        imageSrc=${ifDefined(imageSrc)}
        alt=${ifDefined(alt)}
        theme=${this.themeMode}
        data-testid="ui-qr-code"
      ></ui-qr-code>
    `
  }

  private getWalletConnectImageUrl() {
    const connector = ConnectorController.state.connectors.find(
      cn => cn.id === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID
    )
    if (connector && 'imageId' in connector && connector.imageId) {
      return DiditApiController.getConnectorImageUrl(connector.imageId)
    }

    return null
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
