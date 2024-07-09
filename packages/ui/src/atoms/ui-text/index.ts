import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { resetStyles } from '../../utils/ThemeUtil.js'
import type { ColorType, LineClamp, TextAlign, TextType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

@customElement('ui-text')
export class UiText extends LitElement {
  public static override styles = [resetStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public variant: TextType = 'paragraph-1'

  @property() public color: ColorType = 'foreground'

  @property() public align?: TextAlign = 'left'

  @property() public lineClamp?: LineClamp = undefined

  // -- Render -------------------------------------------- //
  public override render() {
    const classes = {
      [`ui-font-${this.variant}`]: true,
      [`ui-color-${this.color}`]: true,
      // eslint-disable-next-line no-unneeded-ternary
      [`ui-line-clamp-${this.lineClamp}`]: this.lineClamp ? true : false
    }

    this.style.cssText = `
      --local-align: ${this.align};
      --local-color: var(--ui-color-${this.color});
    `

    return html`<slot class=${classMap(classes)}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-text': UiText
  }
}
