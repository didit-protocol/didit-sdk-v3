import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import type { IconType } from '../../utils/TypeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'
import '../../atoms/ui-icon/index.js'
import { classMap } from 'lit/directives/class-map.js'

// -- Types -------------------------------- //
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'tertiary'

@customElement('ui-button')
export class UiButton extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //

  @property({ attribute: 'custom-style' })
  public customStyle?: string

  @property() public variant: ButtonVariant = 'default'

  @property() public icon?: IconType

  @property() public textSize?: 'md' | 'lg' = 'md'

  @property({ type: Boolean }) public fullWidth = false

  @property({ type: Boolean }) public centerText = false

  @property({ type: Boolean }) public loading = false

  @property({ type: Boolean }) public disabled = false

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      --local-width: ${this.fullWidth ? '100%' : 'auto'};
      --local-left-padding: ${this.centerText ? 'var(--ui-spacing-1xs)' : 'var(--ui-spacing-l)'};
    `
    let customStyleString = ''
    if (this.customStyle) {
      const customStyle = JSON.parse(this.customStyle)

      customStyleString = Object.keys(customStyle).reduce((acc, key) => {
        const cssKey = key.replace(/[A-Z]/gu, m => `-${m.toLowerCase()}`)

        return `${acc}${acc ? '; ' : ''}${cssKey}: ${customStyle[key]}`
      }, '')
    }

    const classes = {
      [`button-${this.variant}`]: true
    }

    const textVariant = this.textSize === 'lg' ? 'button-1' : 'button-2'

    const textAlign = this.centerText ? 'center' : 'left'

    return html`
      <button
        style=${customStyleString}
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        ontouchstart
      >
        <ui-text align=${textAlign} variant=${textVariant} color="inherit">
          <slot></slot>
        </ui-text>
        ${this.templateButtonIcon()}
      </button>
    `
  }

  public override connectedCallback() {
    super.connectedCallback()
  }

  // -- Private ------------------------------------------- //

  private templateButtonIcon() {
    if (this.icon || this.loading) {
      const _icon = this.loading ? 'loading' : this.icon

      return html`
        <div class="icon-box" data-loading=${this.loading ? 'true' : 'false'}>
          <ui-icon class=${`icon-${this.variant}`} size="md" name=${_icon}></ui-icon>
        </div>
      `
    }

    return null
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UiButton
  }
}
