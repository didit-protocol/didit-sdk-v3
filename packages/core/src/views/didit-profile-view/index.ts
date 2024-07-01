import { UiHelperUtil, customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import {
  AccountController,
  ConnectionController,
  EventsController,
  ModalController,
  NotificationsController,
  RouterController
} from '../../controllers/index.js'
// Import { CoreHelperUtil } from '../../utils/index.js'

@customElement('didit-profile-view')
export class diditProfileView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() public identifier = AccountController.state.diditSession?.identifier

  @state() private authMethod = AccountController.state.diditSession?.identifierType

  @state() private network = AccountController.state.network

  @state() private disconnecting = false

  public constructor() {
    super()
    this.unsubscribe.push(
      AccountController.subscribe(val => {
        this.identifier = val.diditSession?.identifier
        this.authMethod = val.diditSession?.identifierType
        this.network = val.network
      })
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    if (!this.identifier) {
      throw new Error('didit-profile-view: user is not connected ')
    }

    // Const networkImage = AssetUtil.getNetworkImage(this.network)

    return html`<ui-flex
        flexDirection="column"
        .padding=${['0', 'xl', 'm', 'xl'] as const}
        alignItems="center"
        gap="l"
      >
        <ui-flex flexDirection="column" alignItems="center">
          <ui-flex gap="3xs" alignItems="center" justifyContent="center">
            <ui-text variant="medium-title-600" color="fg-100">
              ${UiHelperUtil.getTruncateString({
                string: this.identifier ? this.identifier : '',
                charsStart: 4,
                charsEnd: 4,
                truncate: 'middle'
              })}
            </ui-text>
          </ui-flex>
        </ui-flex>
      </ui-flex>

      <ui-flex flexDirection="column" gap="xs" .padding=${['0', 's', 's', 's'] as const}>
        <ui-button @click=${this.onNetworks.bind(this)} data-testid="select-network-button">
          ${this.network?.name ?? 'Unknown'}
        </ui-button>
        <ui-button
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="select-network-button"
        >
          Disconnect
        </ui-button>
      </ui-flex>`
  }

  // -- Private ------------------------------------------- //

  private isAllowedNetworkSwitch() {
    if (this.authMethod !== 'wallet_address') {
      return false
    }
    const { requestedNetworks } = AccountController.state
    const isMultiNetwork = requestedNetworks ? requestedNetworks.length > 1 : false
    const isValidNetwork = requestedNetworks?.find(({ id }) => id === this.network?.id)

    return isMultiNetwork || !isValidNetwork
  }

  /*
   * Private onCopyAddress() {
   *   try {
   *     if (this.identifier) {
   *       CoreHelperUtil.copyToClopboard(this.identifier)
   *       NotificationsController.showSuccess('Address copied')
   *     }
   *   } catch {
   *     NotificationsController.showError('Failed to copy')
   *   }
   * }
   */

  private onNetworks() {
    if (this.isAllowedNetworkSwitch()) {
      EventsController.sendEvent({ type: 'track', event: 'CLICK_NETWORKS' })
      RouterController.push('Networks')
    }
  }

  private async onDisconnect() {
    try {
      this.disconnecting = true
      await ConnectionController.disconnect()
      EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_SUCCESS' })
      ModalController.close()
    } catch {
      EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_ERROR' })
      NotificationsController.showError('Failed to disconnect')
    } finally {
      this.disconnecting = false
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-profile-view': diditProfileView
  }
}
