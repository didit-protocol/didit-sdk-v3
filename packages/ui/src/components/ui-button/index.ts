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
  @property() public text = ''

  @property() public variant: ButtonVariant = 'default'

  @property() public icon?: IconType

  @property() public textSize?: 'md' | 'lg' = 'md'

  @property({ type: Boolean }) public fullWidth = false

  @property({ type: Boolean }) public loading = false

  @property({ type: Boolean }) public disabled = false

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      --local-left-padding: ${this.icon || this.loading ? '38px' : ''};
      --local-width: ${this.fullWidth ? '100%' : 'auto'}
    `

    const classes = {
      [`button-${this.variant}`]: true
    }

    const textVariant = this.textSize === 'lg' ? 'button-1' : 'button-2'

    return html`
      <button class=${classMap(classes)} ?disabled=${this.disabled} ontouchstart>
        <ui-text variant=${textVariant} color="inherit">${this.text}</ui-text>
        ${this.templateButtonIcon()}
      </button>
    `
  }

  public override connectedCallback() {
    super.connectedCallback()
    this.animateLoadingIcon()
  }

  public override updated() {
    this.animateLoadingIcon()
  }

  // -- Private ------------------------------------------- //

  private templateButtonIcon() {
    if (this.icon || this.loading) {
      const _icon = this.loading ? 'loading' : this.icon
      const iconVariant = this.variant === 'default' ? 'foreground' : this.variant

      return html`
        <div class="icon-box">
          <ui-icon class=${`icon-${iconVariant}`} size="md" name=${_icon}></ui-icon>
        </div>
      `
    }

    return null
  }

  private animateLoadingIcon() {
    if (this.loading) {
      const icon = this.shadowRoot?.querySelector('ui-icon')
      if (icon) {
        icon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
          duration: 1000,
          iterations: Infinity
        })
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UiButton
  }
}
