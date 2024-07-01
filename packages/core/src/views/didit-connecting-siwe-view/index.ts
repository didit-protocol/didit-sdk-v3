import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import {
  AccountController,
  ConfigurationController,
  ConnectionController,
  DiditAuthController,
  EventsController,
  ModalController,
  NotificationsController,
  RouterController
} from '../../controllers/index.js'

@customElement('didit-connecting-siwe-view')
export class DiditConnectingSiweView extends LitElement {
  // -- Members ------------------------------------------- //
  private readonly dappName = ConfigurationController.state.metadata?.name

  @state() private isSigning = false

  // -- Render -------------------------------------------- //
  public override render() {
    this.onRender()

    return html`
      <wui-flex justifyContent="center" .padding=${['2xl', '0', 'xxl', '0'] as const}>
        <didit-connecting-siwe></didit-connecting-siwe>
      </wui-flex>
      <wui-flex
        .padding=${['0', '4xl', 'l', '4xl'] as const}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName ?? 'Dapp'} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${['0', '3xl', 'l', '3xl'] as const}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${['l', 'xl', 'xl', 'xl'] as const} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          @click=${this.onCancel.bind(this)}
          data-testid="didit-connecting-siwe-cancel"
        >
          Cancel
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="didit-connecting-siwe-sign"
        >
          ${this.isSigning ? 'Signing...' : 'Sign'}
        </wui-button>
      </wui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  /*
   * Check if the user is already connected
   */
  private onRender() {
    if (DiditAuthController.state.session) {
      ModalController.close()
    }
  }

  private async onSign() {
    this.isSigning = true
    EventsController.sendEvent({
      event: 'CLICK_SIGN_SIWE_MESSAGE',
      type: 'track',
      properties: {
        network: AccountController.state.network?.id || ''
      }
    })
    try {
      DiditAuthController.setStatus('loading')
      const session = await DiditAuthController.web3SignIn()
      DiditAuthController.setStatus('success')

      EventsController.sendEvent({
        event: 'SIWE_AUTH_SUCCESS',
        type: 'track',
        properties: {
          network: AccountController.state.network?.id || ''
        }
      })

      return session
    } catch (error) {
      NotificationsController.showError('Signature declined')
      DiditAuthController.setStatus('error')

      return EventsController.sendEvent({
        event: 'SIWE_AUTH_ERROR',
        type: 'track',
        properties: {
          network: AccountController.state.network?.id || ''
        }
      })
    } finally {
      this.isSigning = false
    }
  }

  private async onCancel() {
    const { isWalletConnected } = AccountController.state
    if (isWalletConnected) {
      await ConnectionController.disconnect()
      ModalController.close()
    } else {
      RouterController.push('Connect')
    }
    EventsController.sendEvent({
      event: 'CLICK_CANCEL_SIWE',
      type: 'track',
      properties: {
        network: AccountController.state.network?.id || ''
      }
    })
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-siwe-view': DiditConnectingSiweView
  }
}
