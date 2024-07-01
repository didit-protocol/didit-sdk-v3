import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
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
import styles from './styles.js'

@customElement('didit-connecting-siwe-view')
export class DiditConnectingSiweView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private readonly dappName = ConfigurationController.state.metadata?.name || 'Didit'

  private readonly wallet = ConnectionController.getRecentWallet()

  @state() private isSigning = false

  @state() private error = false

  // -- Render -------------------------------------------- //

  public override disconnectedCallback() {
    super.disconnectedCallback()
    this.onCancel()
  }

  public override render() {
    this.onRender()

    const walletImageUrl = this.wallet?.imageUrl || ''

    return html`
      <ui-flex
        .padding=${['3xl', '0', '0', '0']}
        data-error=${ifDefined(this.error)}
        flexDirection="column"
        alignItems="center"
        gap="3xl"
      >
        <ui-flex
          flexDirection="column"
          alignItems="center"
          gap="xxl"
          .padding=${['xl', '0', 'xl', '0']}
        >
          <ui-didit-link
            connectorImage=${walletImageUrl}
            connectorIcon="wallet"
            ?loading=${this.isSigning}
            ?logoBouncing=${this.error}
          >
          </ui-didit-link>
          <ui-flex flexDirection="column" alignItems="center" gap="s">
            <ui-text variant="title-4" color=${this.error ? 'error' : 'foreground'}>
              Connect your wallet to ${this.dappName}
            </ui-text>
            <ui-text align="center" variant="paragraph-1" color="surface-md">
              Sign this message to connect. Canceling will disconnect your wallet.
            </ui-text>
          </ui-flex>
        </ui-flex>
        <ui-button
          text="Sign message"
          ?loading=${this.isSigning}
          textSize="lg"
          data-testid=${`sign-button`}
          @click=${this.onSign.bind(this)}
        ></ui-button>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private onRender() {
    if (DiditAuthController.state.session) {
      ModalController.close()
    }
  }

  private async onSign() {
    this.error = false
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
      this.error = true

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
