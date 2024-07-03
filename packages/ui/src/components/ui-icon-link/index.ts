import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { colorStyles, elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import type { ColorType, IconType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import '../../atoms/ui-icon/index.js'
import styles from './styles.js'

@customElement('ui-icon-link')
export class UiIconLink extends LitElement {
  public static override styles = [resetStyles, elementStyles, colorStyles, styles]

  // -- State & Properties -------------------------------- //

  @property({ type: Boolean }) public disabled = false

  @property() public icon: IconType = 'copy'

  @property() public iconColor: ColorType = 'inherit'

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      --local-border-radius: var(--ui-border-radius-s);
      --local-padding: var(--ui-spacing-1xs);
    `

    return html`
      <button ?disabled=${this.disabled} ontouchstart>
        <ui-icon color=${this.iconColor} size="md" name=${this.icon}></ui-icon>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon-link': UiIconLink
  }
}
