import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'
import { RouterController } from '../../controllers/Router.js'

@customElement('didit-connect-view')
export class DiditConnectView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //

  public constructor() {
    super()
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex flexDirection="column" .padding=${['3xl', '0', '0', '0']}>
        <ui-flex gap="xs">
          <ui-text variant="styled-label" color="foreground">login with</ui-text>
          <ui-text variant="styled-label" color="primary">didit</ui-text>
        </ui-flex>
        <ui-text variant="title-1" color="foreground" class="title">
          Your trusted decentralized identity
        </ui-text>
        <didit-socials-view></didit-socials-view>
        <ui-button
          variant="primary"
          icon="connect"
          textSize="lg"
          ?centerText=${true}
          data-testid=${`wallets-button`}
          @click=${this.onContinueWalletClick.bind(this)}
        >
          Connect wallet
        </ui-button>
      </ui-flex>
    `
    // <didit-legal-footer></didit-legal-footer>
  }

  // -- Private Methods ----------------------------------- //
  private onContinueWalletClick() {
    RouterController.push('Wallets')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connect-view': DiditConnectView
  }
}
