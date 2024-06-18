import { customElement } from '@web3modal/ui'
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
      <wui-flex flexDirection="column" .padding=${['3xs', 's', 's', 's']}>
        <wui-list-wallet
          name="Continue with Socials"
          walletIcon="allWallets"
          @click=${this.onContinueSocialsClick.bind(this)}
          tagVariant="shade"
          data-testid="all-wallets"
        ></wui-list-wallet>
        <wui-list-wallet
          name="Continue with Wallet"
          walletIcon="allWallets"
          @click=${this.onContinueWalletClick.bind(this)}
          tagVariant="shade"
          data-testid="all-wallets"
        ></wui-list-wallet>
      </wui-flex>
      <didit-legal-footer></didit-legal-footer>
    `
  }

  // -- Private Methods ----------------------------------- //
  private onContinueWalletClick() {
    RouterController.push('Wallets')
  }
  private onContinueSocialsClick() {
    RouterController.push('Socials')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connect-view': DiditConnectView
  }
}
