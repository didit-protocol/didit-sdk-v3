import { customElement } from '@didit-sdk/ui'
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
      <ui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${['xxl', '0', '0', '0']}
        gap="xxl"
      >
        <ui-wallet-image
          size="xl"
          ?withPadding=${true}
          imageSrc=${this.wallet?.image_url}
        ></ui-wallet-image>

        <ui-text variant="paragraph-1" color="surface-md">Not Detected</ui-text>

        <didit-mobile-download-links .wallet=${this.wallet}></didit-mobile-download-links>
      </ui-flex>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-unsupported': DiditConnectingWcUnsupported
  }
}
