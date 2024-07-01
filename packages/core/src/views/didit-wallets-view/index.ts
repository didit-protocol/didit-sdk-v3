import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { ConnectorController } from '../../controllers/Connectors.js'
import styles from './styles.js'
import type { Connector, WcWallet } from '../../types/index.js'
import { RouterController } from '../../controllers/Router.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { DiditApiController } from '../../controllers/DiditApi.js'

@customElement('didit-wallets-view')
export class DiditWalletsView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private connectors = ConnectorController.state.connectors
  @state() private wcWallets = ConnectorController.state.wcWallets

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectorController.subscribeKey('connectors', val => (this.connectors = val)),
      ConnectorController.subscribeKey('wcWallets', val => (this.wcWallets = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex flexDirection="column" .padding=${['3xl', '0', '0', '0']} gap="xs">
        ${this.connectWalletConnectTemplate()} ${this.connectAnnouncedTemplate()}
        ${this.connectInjectedTemplate()} ${this.connectCoinbaseTemplate()}
        ${this.connectWcWalletsTemplate()}
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private connectWalletConnectTemplate() {
    if (CoreHelperUtil.isMobile()) {
      return null
    }

    const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT')
    if (!connector) {
      return null
    }

    let imageUrl = connector.imageUrl
    if (!imageUrl && CoreHelperUtil.isWeb3Connector(connector) && connector.imageId) {
      imageUrl = DiditApiController.getConnectorImageUrl(connector.imageId)
    }

    return html`
      <ui-wallet-button
        walletImage=${imageUrl}
        name=${connector.name ?? 'Unknown'}
        @click=${() => this.onWalletConnectConnector(connector)}
        tagLabel="qr code"
        tagVariant="main"
        data-testid="wallet-selector-walletconnect"
      >
      </ui-wallet-button>
    `
  }

  private connectAnnouncedTemplate() {
    const announcedConnectors = this.connectors.filter(connector => connector.type === 'ANNOUNCED')

    if (!announcedConnectors?.length) {
      return null
    }

    return html`
      ${announcedConnectors.map(
        connector => html`
          <ui-wallet-button
            walletImage=${connector.imageUrl}
            name=${connector.name ?? 'Unknown'}
            @click=${() => this.onWalletConnectConnector(connector)}
            tagVariant="success"
            tagLabel="installed"
            data-testid=${`wallet-selector-${connector.id}`}
          >
          </ui-wallet-button>
        `
      )}
    `
  }

  private connectInjectedTemplate() {
    const injectedConnectors = this.connectors.filter(connector => connector.type === 'INJECTED')

    if (
      !injectedConnectors?.length ||
      (injectedConnectors.length === 1 &&
        injectedConnectors[0]?.name === 'Browser Wallet' &&
        !CoreHelperUtil.isMobile())
    ) {
      return null
    }

    return html`
      ${injectedConnectors.map(connector => {
        if (
          !CoreHelperUtil.isMobile() &&
          (connector.name === 'Browser Wallet' || connector.name === 'Injected')
        ) {
          return null
        }

        if (!ConnectionController.checkInstalled()) {
          return null
        }

        return html`
          <ui-wallet-button
            walletImage=${connector.imageUrl}
            name=${connector.name ?? 'Unknown'}
            @click=${() => this.onWalletConnectConnector(connector)}
            tagVariant="success"
            tagLabel="installed"
            data-testid=${`wallet-selector-${connector.id}`}
          >
          </ui-wallet-button>
        `
      })}
    `
  }

  private connectCoinbaseTemplate() {
    const coinbaseConnector = this.connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    )

    if (!coinbaseConnector) {
      return null
    }

    let imageUrl = coinbaseConnector.imageUrl
    if (
      !imageUrl &&
      CoreHelperUtil.isWeb3Connector(coinbaseConnector) &&
      coinbaseConnector.imageId
    ) {
      imageUrl = DiditApiController.getConnectorImageUrl(coinbaseConnector.imageId)
    }

    return html`
      <ui-wallet-button
        walletImage=${ifDefined(imageUrl)}
        name=${ifDefined(coinbaseConnector.name)}
        @click=${() => this.onConnector(coinbaseConnector)}
        data-testid=${`wallet-selector-${coinbaseConnector.id}`}
      >
      </ui-wallet-button>
    `
  }

  private connectWcWalletsTemplate() {
    if (!this.wcWallets.length) {
      return null
    }

    const wallets = this.filterOutDuplicateWallets()

    return html`
      ${wallets.map(
        wallet => html`
          <ui-wallet-button
            walletImage=${wallet.image_url}
            name=${wallet.name ?? 'Unknown'}
            @click=${() => this.onWcWalletsConnector(wallet)}
          >
          </ui-wallet-button>
        `
      )}
    `
  }

  // -- Private Methods ----------------------------------- //
  private onWalletConnectConnector(connector: Connector) {
    if (connector.type === 'WALLET_CONNECT') {
      if (CoreHelperUtil.isMobile()) {
        throw new Error(
          'WalletConnect is not supported on mobile, we should not reach this condition'
        )
        // RouterController.push('AllWallets')
      } else {
        RouterController.push('ConnectWalletConnect')
      }
    } else {
      RouterController.push('ConnectWallet', { connector })
    }
  }

  private onConnector(connector: Connector) {
    RouterController.push('ConnectWallet', { connector })
    /*
     * TODOX: coinbase popup is blocked by some browsers when opened programmatically
     * https://developer.mozilla.org/en-US/docs/Web/API/Window/open#description
     * We should trigget connect from  this function and skip it on 'ConnectWallet' view
     */
  }

  private onWcWalletsConnector(wallet: WcWallet) {
    RouterController.push('ConnectWalletConnect', { wallet })
  }

  private filterOutDuplicateWallets() {
    const connectorRDNSs = this.connectors
      .filter(CoreHelperUtil.isWeb3Connector)
      .map(connector => connector.info?.rdns)
      .filter(Boolean) as string[]

    if (connectorRDNSs.includes('io.metamask.mobile') && CoreHelperUtil.isMobile()) {
      const index = connectorRDNSs.indexOf('io.metamask.mobile')
      connectorRDNSs[index] = 'io.metamask'
    }
    const filtered = this.wcWallets.filter(wallet => !connectorRDNSs.includes(String(wallet?.rdns)))

    return filtered
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-wallets-view': DiditWalletsView
  }
}
