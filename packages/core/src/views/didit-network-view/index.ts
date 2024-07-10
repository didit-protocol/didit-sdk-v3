import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import {
  AccountController,
  ConnectionController,
  EventsController,
  NotificationsController
} from '../../controllers/index.js'
import type { Web3Network } from '../../types/web3.js'

@customElement('didit-network-view')
export class diditNetworkView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private authMethod = AccountController.state.authMethod

  @state() private requestedNetworks = AccountController.state.requestedNetworks

  @state() private network = AccountController.state.network

  public constructor() {
    super()
    this.unsubscribe.push(
      AccountController.subscribeKey('authMethod', val => (this.authMethod = val)),
      AccountController.subscribeKey('requestedNetworks', val => (this.requestedNetworks = val)),
      AccountController.subscribeKey('network', val => (this.network = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex class="network-container" flexDirection="column" padding="1xs" gap="xxs">
        ${this.requestedNetworks.map(net => {
          const isActiveNetwork = this.network?.number === net.number

          return html`
            <button
              class="network-button"
              @click=${this.onNetworksSelect.bind(this, net)}
              data-testid="select-network-button"
            >
              <ui-flex gap="1xs" alignItems="center" data-netid=${net.id}>
                <ui-wallet-image
                  size="xs"
                  imageSrc=${net.imageUrl}
                  walletIcon="network"
                ></ui-wallet-image>
                <ui-text variant="button-1" color="inherit">${net.name}</ui-text>
              </ui-flex>
              ${isActiveNetwork ? html`<ui-tag variant="default">Active</ui-tag>` : null}
            </button>
          `
        })}
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private async onNetworksSelect(network: Web3Network) {
    if (network.number === this.network?.number) {
      return
    }
    if (this.isAllowedNetworkSwitch()) {
      EventsController.sendEvent({
        type: 'track',
        event: 'SWITCH_NETWORK',
        properties: {
          network: network.name
        }
      })
      try {
        await ConnectionController.switchNetwork(network.number)
        NotificationsController.showSuccess('Network switched successfully')
        EventsController.sendEvent({ type: 'track', event: 'SWITCH_NETWORK_SUCCESS' })
      } catch (error) {
        NotificationsController.showError('Failed to switch network')
        EventsController.sendEvent({
          type: 'track',
          event: 'SWITCH_NETWORK_ERROR',
          properties: {
            message: 'UNKNOWN_ERROR'
          }
        })
      }
    }
  }

  private isAllowedNetworkSwitch() {
    if (!this.authMethod || this.authMethod !== 'wallet') {
      return false
    }
    const { requestedNetworks } = AccountController.state
    const isMultiNetwork = requestedNetworks ? requestedNetworks.length > 1 : false
    const isValidNetwork = requestedNetworks?.find(({ id }) => id === this.network?.id)

    return isMultiNetwork || !isValidNetwork
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-network-view': diditNetworkView
  }
}
