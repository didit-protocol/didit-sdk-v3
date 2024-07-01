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

@customElement('didit-socials-view')
export class DiditSocialsView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
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
    return html` <ui-flex gap="s" alignItems="center"> ${this.connectSocialsTemplate()} </ui-flex> `
  }

  // -- Private ------------------------------------------- //

  private connectSocialsTemplate() {
    const socialConnectors = this.connectors.filter(CoreHelperUtil.isSocialConnector)

    if (!socialConnectors.length) {
      return null
    }

    return html`
      ${socialConnectors.map(
        connector => html`
          <ui-button
            variant=${this.getButtonVariant(connector.type)}
            text=${`Signin with ${connector.name}`}
            icon=${connector.type}
            data-testid=${`socail-selector-${connector.id}`}
            @click=${() => this.onConnector(connector)}
          >
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
    const res = ConnectionController.connectSocialProvider(connector.provider)
    DiditAuthController.setPopup(res.popupWindow)
    DiditAuthController.setSocialProvider(connector.provider)
    DiditAuthController.setCodeVerifier(res.codeVerifier)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-socials-view': DiditSocialsView
  }
}
