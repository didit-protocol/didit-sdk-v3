import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import styles from './styles.js'
import type { IconType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'

@customElement('ui-didit-link')
export class UiDiditLink extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- Properties -------------------------------- //

  @property({ type: Boolean }) public loading = false

  @property({ type: Boolean }) public logoBouncing = false

  @property() public connectorImage = ''

  @property() public connectorIcon: IconType = 'wallet'

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      --local-loader-opacity: ${this.loading ? '1' : '0'};
    `

    return html`
      <ui-flex justifyContent="space-between" alignItems="center" gap="xs">
        <div class="ui-didit-link-loader">
          <ui-didit-link-loader></ui-didit-link-loader>
        </div>
        <ui-wallet-image
          data-icon=${this.connectorIcon}
          size="xl"
          ?withPadding=${true}
          imageSrc=${this.connectorImage}
          walletIcon=${this.connectorIcon}
        >
        </ui-wallet-image>
        <ui-wallet-image
          data-bounce=${this.logoBouncing ? 'true' : 'false'}
          size="xl"
          walletIcon="didit"
        >
        </ui-wallet-image>
      </ui-flex>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-didit-link': UiDiditLink
  }
}
