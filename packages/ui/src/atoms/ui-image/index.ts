import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { colorStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'
import type { BorderRadiusType, SizeType } from '../../utils/TypeUtil.js'

@customElement('ui-image')
export class UiImage extends LitElement {
  public static override styles = [resetStyles, colorStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public src = './path/to/image.jpg'

  @property() public alt = 'Image'

  @property() public size?: SizeType = undefined

  @property() public borderRadius?: BorderRadiusType = '0'

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
        --local-width: ${this.size ? `var(--ui-icon-size-${this.size});` : '100%'};
        --local-height: ${this.size ? `var(--ui-icon-size-${this.size});` : '100%'};
        --local-border-radius: var(--ui-border-radius-${this.borderRadius});
      `

    return html`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`
  }

  private handleImageError() {
    this.dispatchEvent(new CustomEvent('onLoadError', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-image': UiImage
  }
}
