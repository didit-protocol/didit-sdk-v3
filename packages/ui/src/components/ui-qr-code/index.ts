import { html, LitElement, svg } from 'lit'
import { property } from 'lit/decorators.js'
import { QrCodeUtil } from '../../utils/QrCode.js'
import { resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

@customElement('ui-qr-code')
export class UiQrCode extends LitElement {
  public static override styles = [resetStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public uri = ''

  @property({ type: Number }) public size = 0

  @property() public imageSrc?: string = undefined

  @property() public alt?: string = undefined

  @property({ type: Boolean }) public arenaClear?: boolean = undefined

  // -- Render -------------------------------------------- //
  public override render() {
    this.dataset['clear'] = String(this.arenaClear)
    this.style.cssText = `--local-size: ${this.size}px`

    return html`${this.templateVisual()} ${this.templateSvg()}`
  }

  // -- Private ------------------------------------------- //
  private templateSvg() {
    return svg`
      <svg height=${this.size} width=${this.size}>
        ${QrCodeUtil.generate(this.uri, this.size, this.arenaClear ? 0 : this.size / 4)}
      </svg>
    `
  }

  private templateVisual() {
    if (this.imageSrc) {
      return html`<ui-image src=${this.imageSrc} alt=${this.alt ?? 'logo'}></ui-image>`
    }

    return html`<ui-icon size="inherit" color="inherit" name="didit"></ui-icon>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-qr-code': UiQrCode
  }
}
