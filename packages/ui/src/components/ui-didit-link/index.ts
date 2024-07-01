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
          size="xl"
          ?withPadding=${true}
          walletImage=${this.connectorImage}
          walletIcon=${this.connectorIcon}
        >
        </ui-wallet-image>
        <ui-icon
          data-bounce=${this.logoBouncing}
          class="didit-logo"
          size="2xl"
          color="inherit"
          name="didit"
        ></ui-icon>
      </ui-flex>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-didit-link': UiDiditLink
  }
}
