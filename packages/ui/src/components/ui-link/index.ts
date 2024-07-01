import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

// -- Component ------------------------------------------ //
@customElement('ui-link')
export class UiLink extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //

  @property() public icon = ''

  @property({ type: Boolean }) public disabled = false

  @property({ type: Boolean }) public hasIconLeft = false

  @property({ type: Boolean }) public hasIconRight = false

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <button ?disabled=${this.disabled} ontouchstart>
        ${this.hasIconLeft ? html`<ui-icon size="sm" name=${this.icon}></ui-icon>` : null}
        <ui-text variant="link" color="inherit">
          <slot></slot>
        </ui-text>
        ${this.hasIconRight ? html`<ui-icon size="sm" name=${this.icon}></ui-icon>` : null}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-link': UiLink
  }
}
