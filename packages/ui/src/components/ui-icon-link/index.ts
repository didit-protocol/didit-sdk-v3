import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { colorStyles, elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import type { ColorType, IconType, SizeType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import '../../atoms/ui-icon/index.js'
import styles from './styles.js'

@customElement('ui-icon-link')
export class UiIconLink extends LitElement {
  public static override styles = [resetStyles, elementStyles, colorStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public size: SizeType = 'md'

  @property({ type: Boolean }) public disabled = false

  @property() public icon: IconType = 'copy'

  @property() public iconColor: ColorType = 'inherit'

  // -- Render -------------------------------------------- //
  public override render() {
    const borderRadius = this.size === 'lg' ? '--ui-border-radius-s' : '--ui-border-radius-xs'
    const padding = this.size === 'lg' ? '--ui-spacing-1xs' : '--ui-spacing-2xs'

    this.style.cssText = `
      --local-border-radius: var(${borderRadius});
      --local-padding: var(${padding});
    `

    return html`
      <button ?disabled=${this.disabled} ontouchstart>
        <ui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></ui-icon>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon-link': UiIconLink
  }
}
