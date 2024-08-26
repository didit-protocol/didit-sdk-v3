import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ConnectorController } from '../../controllers/Connectors.js'
import styles from './styles.js'
import type { SocialConnector, SocialConnectorType } from '../../types/index.js'
import { RouterController } from '../../controllers/Router.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { DiditAuthController } from '../../controllers/DiditAuth.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { ConfigurationController } from '../../controllers/Configuration.js'

@customElement('didit-socials-view')
export class DiditSocialsView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private readonly socialProvides = ConfigurationController.state.providers
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private connectors = ConnectorController.state.connectors

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectorController.subscribeKey('connectors', val => (this.connectors = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex gap="s" flexWrap="wrap" alignItems="center">
        ${this.connectSocialsTemplate()}
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private connectSocialsTemplate() {
    const socialConnectors = this.connectors
      .filter(CoreHelperUtil.isSocialConnector)
      .filter(cnt => this.socialProvides.includes(cnt.provider))

    if (!socialConnectors.length) {
      return null
    }

    return html`
      ${socialConnectors.map(
        connector => html`
          <ui-button
            data-provider=${connector.provider}
            variant=${this.getButtonVariant(connector.type)}
            icon=${connector.type}
            data-testid=${`socail-selector-${connector.id}`}
            @click=${() => this.onConnector(connector)}
          >
            ${`Signin with ${connector.name}`}
          </ui-button>
        `
      )}
    `
  }

  private getButtonVariant(type: SocialConnectorType) {
    switch (type) {
      case 'google':
        return 'secondary'
      case 'apple':
        return 'tertiary'
      default:
        return 'secondary'
    }
  }

  private onConnector(connector: SocialConnector) {
    RouterController.push('ConnectSocial', { connector })
    DiditAuthController.setSocialProvider(connector.provider)
    /*
     * Open popup only if it's not mobile. on mobile,
     * we need to open the popup on user interaction
     */
    if (!CoreHelperUtil.isMobile()) {
      const res = ConnectionController.connectSocialProvider(connector.provider)
      DiditAuthController.setPopup(res.popupWindow)
      DiditAuthController.setCodeVerifier(res.codeVerifier)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-socials-view': DiditSocialsView
  }
}
