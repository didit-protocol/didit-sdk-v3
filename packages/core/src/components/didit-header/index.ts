import { customElement, UiHelperUtil } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import { RouterController, type RouterControllerState } from '../../controllers/Router.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { ModalController } from '../../controllers/Modal.js'
import type { RouterView } from '../../types/config.js'
import { DiditAuthController } from '../../controllers/DiditAuth.js'
import { AccountController } from '../../controllers/Account.js'

// -- Helpers ------------------------------------------- //

function headings(): { [key in RouterView]: string } {
  const connectorName = RouterController.state.data?.connector?.name
  const walletName = RouterController.state.data?.wallet?.name
  const networkName = AccountController.state.network?.name
  const name = walletName ?? connectorName

  return {
    Connect: `Connect with Didit`,
    Wallets: 'Select wallet',
    ConnectWallet: `Connecting ${name ?? 'wallet'}`,
    ConnectWalletConnect: `Connecting ${name ?? 'wallet'}`,
    ConnectSocial: `Signin with ${name}`,
    ConnectingDiditSiwe: 'Signature request',
    Help: 'How to signin with Didit',
    Profile: 'Profile',
    Networks: `Switch Network: ${networkName}`
  }
}

@customElement('didit-header')
export class DiditHeader extends LitElement {
  public static override styles = [styles]

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties --------------------------------- //
  @state() private heading = headings()[RouterController.state.view]

  @state() private buffering = false

  @state() private showBack = false

  @state() private session = AccountController.state.diditSession

  public constructor() {
    super()
    this.unsubscribe.push(
      RouterController.subscribeKey('view', val => {
        this.onViewChange(val)
        this.onHistoryChange()
      }),
      ConnectionController.subscribeKey('buffering', val => (this.buffering = val)),
      AccountController.subscribeKey('diditSession', val => (this.session = val))
    )
  }

  disconnectCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex alignItems="center" gap="s">
        ${this.dynamicButtonTemplate()} ${this.titleTemplate()}
        <ui-icon-link
          class="close-button"
          ?disabled=${this.buffering}
          icon="close"
          @click=${this.onClose.bind(this)}
          data-testid="didit-header-close"
        ></ui-icon-link>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private onWalletHelp() {
    RouterController.push('Help')
  }

  private async onClose() {
    if (DiditAuthController.state.status !== 'success') {
      await ConnectionController.disconnect()
    }

    ModalController.close()
  }

  private titleTemplate() {
    if (RouterController.state.view === 'Profile') {
      let name = ''

      if (this.session?.identifierType === 'wallet_address') {
        name = UiHelperUtil.getTruncateString({
          string: this.session.identifier ? this.session.identifier : '',
          charsStart: 4,
          charsEnd: 4,
          truncate: 'middle'
        })
      } else {
        name = this.session?.identifier || ''
      }

      return html`
        <ui-flex class="ui-header-title">
          <ui-user-card identifier=${name} /> </ui-user-card>
        <ui-flex class="ui-header-title">
      `
    }

    return html`
      <ui-flex class="ui-header-title">
        <ui-text variant="title-4" color="foreground"> ${this.heading} </ui-text>
      </ui-flex>
    `
  }

  private dynamicButtonTemplate() {
    const { view } = RouterController.state
    const isConnectHelp = view === 'Connect'
    const isProfile = view === 'Profile'
    const isConnectingDiditSIWE = view === 'ConnectingDiditSiwe'

    const shouldHideBack = isProfile || isConnectingDiditSIWE

    if (this.showBack && !shouldHideBack) {
      return html`<ui-icon-link
        id="dynamic"
        icon="arrowLeft"
        ?disabled=${this.buffering}
        @click=${this.onGoBack.bind(this)}
      ></ui-icon-link>`
    }

    return html`
      <ui-icon-link
        data-hidden=${!isConnectHelp}
        id="dynamic"
        icon="help"
        @click=${this.onWalletHelp.bind(this)}
      ></ui-icon-link>
    `
  }

  private async onViewChange(view: RouterControllerState['view']) {
    const headingEl = this.shadowRoot?.querySelector('ui-flex.ui-header-title')

    if (headingEl) {
      const preset = headings()[view]
      await headingEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      }).finished
      this.heading = preset
      headingEl.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      })
    }
  }

  private async onHistoryChange() {
    const { history } = RouterController.state
    const buttonEl = this.shadowRoot?.querySelector('#dynamic')
    if (history.length > 1 && !this.showBack && buttonEl) {
      await buttonEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      }).finished
      this.showBack = true
      buttonEl.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      })
    } else if (history.length <= 1 && this.showBack && buttonEl) {
      await buttonEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      }).finished
      this.showBack = false
      buttonEl.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      })
    }
  }

  private onGoBack() {
    RouterController.goBack()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-header': DiditHeader
  }
}
