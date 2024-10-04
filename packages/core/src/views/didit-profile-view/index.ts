import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
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
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'

@customElement('didit-profile-view')
export class diditProfileView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() public identifier = AccountController.state.diditSession?.identifier

  @state() private authMethod = AccountController.state.diditSession?.identifierType

  @state() private network = AccountController.state.network

  @state() private profileLink = ConfigurationController.state.profileLink || ''

  public constructor() {
    super()
    this.unsubscribe.push(
      AccountController.subscribe(val => {
        this.identifier = val.diditSession?.identifier
        this.authMethod = val.diditSession?.identifierType
        this.network = val.network
      }),
      ConfigurationController.subscribeKey('profileLink', val => {
        this.profileLink = val || ''
      })
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex class="profile-container" flexDirection="column" padding="1xs" gap="xxs">
        ${this.templateNetworkButton()}
        <button
          class="profile-button"
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <ui-flex gap="xs" alignItems="center">
            <ui-icon name="logout" size="md"></ui-icon>
            <ui-text variant="button-1" color="inherit">Disconnect</ui-text>
          </ui-flex>
        </button>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private templateNetworkButton() {
    if (this.isAllowedNetworkSwitch()) {
      return html`
        <button
          class="profile-button"
          @click=${this.onNetworks.bind(this)}
          data-testid="select-network-button"
        >
          <ui-flex gap="1xs" alignItems="center">
            <ui-icon name="network" size="md"></ui-icon>
            <ui-text variant="button-1" color="inherit">Network</ui-text>
          </ui-flex>
          <ui-flex gap="l" alignItems="center">
            <ui-tag variant="default">${this.network?.name ?? 'Unknown'}</ui-tag>
            <ui-icon name="arrowRight" size="md"></ui-icon>
          </ui-flex>
        </button>
      `
    }

    return null
  }

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

  private onProfile() {
    EventsController.sendEvent({ type: 'track', event: 'CLICK_PROFILE_LINK' })

    if (CoreHelperUtil.isFullURL(this.profileLink)) {
      CoreHelperUtil.openHref(this.profileLink, '_blank')
    } else if (CoreHelperUtil.isPath(this.profileLink)) {
      window.location.href = this.profileLink
      ModalController.close()
    }
  }

  private onNetworks() {
    EventsController.sendEvent({ type: 'track', event: 'CLICK_NETWORKS' })
    RouterController.push('Networks')
  }

  private async onDisconnect() {
    try {
      ModalController.close()
      await DiditAuthController.signOut()
      if (AccountController.state.isWalletConnected) {
        await ConnectionController.disconnect()
      }
      EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_SUCCESS' })
      NotificationsController.showSuccess('Disconnected successfully')
    } catch {
      EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_ERROR' })
      NotificationsController.showError('Failed to disconnect')
      ModalController.open()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-profile-view': diditProfileView
  }
}
