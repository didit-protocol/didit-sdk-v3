/* eslint-disable prettier/prettier */
import { UiHelperUtil, customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'
import {
  AccountController,
  ConnectionController,
  EventsController,
  ModalController,
  NotificationsController,
  RouterController
} from '../../controllers'
import { CoreHelperUtil } from '../../utils'

@customElement('didit-profile-view')
export class W3mAccountDefaultWidget extends LitElement {
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

    return html`<wui-flex
        flexDirection="column"
        .padding=${['0', 'xl', 'm', 'xl'] as const}
        alignItems="center"
        gap="l"
      >
        <wui-avatar
          alt=${ifDefined(this.authMethod)}
          address=${ifDefined(this.identifier)}
          imageSrc=${ifDefined(undefined)}
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="3xs" alignItems="center" justifyContent="center">
            <wui-text variant="medium-title-600" color="fg-100">
              ${UiHelperUtil.getTruncateString({
                string: this.identifier ? this.identifier : '',
                charsStart: 4,
                charsEnd: 4,
                truncate: 'middle'
              })}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="fg-200"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${['0', 's', 's', 's'] as const}>
        <w3m-account-auth-button></w3m-account-auth-button>

        <wui-list-item
          .variant="icon"
          iconVariant="overlay"
          icon="networkPlaceholder"
          ?chevron=${true}
          @click=${this.onNetworks.bind(this)}
          data-testid="w3m-account-select-network"
        >
          <wui-text variant="paragraph-500" color="fg-100">
            ${this.network?.name ?? 'Unknown'}
          </wui-text>
        </wui-list-item>
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${false}
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`
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

  private onCopyAddress() {
    try {
      if (this.identifier) {
        CoreHelperUtil.copyToClopboard(this.identifier)
        NotificationsController.showSuccess('Address copied')
      }
    } catch {
      NotificationsController.showError('Failed to copy')
    }
  }

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
    'w3m-account-default-widget': W3mAccountDefaultWidget
  }
}
