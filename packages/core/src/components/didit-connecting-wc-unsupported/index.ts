import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { EventsController, RouterController } from '../../controllers/index.js'

@customElement('didit-connecting-wc-unsupported')
export class DiditConnectingWcUnsupported extends LitElement {
  // -- Members ------------------------------------------- //
  private readonly wallet = RouterController.state.data?.wallet

  public constructor() {
    super()
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-unsupported: No wallet provided')
    }
    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: { name: this.wallet.name, platform: 'browser' }
    })
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${['3xl', 'xl', 'xl', 'xl'] as const}
        gap="xl"
      >
        <wui-wallet-image size="lg" imageSrc=${this.wallet?.image_url}></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <didit-mobile-download-links .wallet=${this.wallet}></didit-mobile-download-links>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-unsupported': DiditConnectingWcUnsupported
  }
}
