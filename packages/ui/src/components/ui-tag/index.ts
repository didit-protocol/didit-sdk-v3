import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { resetStyles } from '../../utils/ThemeUtil.js'
import type { TagType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import '../../atoms/ui-text/index.js'
import styles from './styles.js'

@customElement('ui-tag')
export class UiTag extends LitElement {
  public static override styles = [resetStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public variant: TagType = 'default'

  // -- Render -------------------------------------------- //
  public override render() {
    this.dataset['variant'] = this.variant

    return html`
      <ui-text data-variant=${this.variant} variant="label" color="inherit">
        <slot></slot>
      </ui-text>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tag': UiTag
  }
}
