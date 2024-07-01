import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import type { TagType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

@customElement('ui-wallet-button')
export class UiWalletButton extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //

  @property() public name = ''

  @property() public walletImage? = ''

  @property() public tagLabel?: string

  @property() public tagVariant?: TagType

  @property({ type: Boolean }) public disabled = false

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <button ?disabled=${this.disabled} ontouchstart>
        <ui-flex alignItems="center" gap="1xs">
          <ui-wallet-image size="sm" imageSrc=${ifDefined(this.walletImage)}></ui-wallet-image>
          <ui-text variant="button-1" color="foreground">${this.name}</ui-text>
        </ui-flex>
        <ui-flex class="left-side" alignItems="center" gap="1xs">
          ${this.templateStatus()}
          <ui-icon size="xl" name="arrowRight"></ui-icon>
        </ui-flex>
      </button>
    `
  }

  // -- Private ------------------------------------------- //

  private templateStatus() {
    if (this.tagLabel && this.tagVariant) {
      return html`<ui-tag variant=${this.tagVariant}>${this.tagLabel}</ui-tag>`
    }

    return null
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-wallet-button': UiWalletButton
  }
}
