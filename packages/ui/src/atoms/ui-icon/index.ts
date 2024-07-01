import type { TemplateResult } from 'lit'
import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { colorStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import type { ColorType, IconType, SizeType } from '../../utils/TypeUtil.js'
import styles from './styles.js'

// -- Svg's-------------------------------- //
import { appleSvg } from '../../assets/icons/apple.js'
import { arrowLeftSvg } from '../../assets/icons/arrow-left.js'
import { closeSvg } from '../../assets/icons/close.js'
import { connectSvg } from '../../assets/icons/connect.js'
import { googleSvg } from '../../assets/icons/google.js'
import { helpCircleSvg } from '../../assets/icons/help-circle.js'
import { walletSvg } from '../../assets/icons/wallet.js'
import { retrySvg } from '../../assets/icons/retry.js'
import { copySvg } from '../../assets/icons/copy.js'
import { diditLogoSvg } from '../../assets/icons/didit-logo.js'
import { arrowRightSvg } from '../../assets/icons/arrow-right.js'
import { externalLinkSvg } from '../../assets/icons/external-link.js'
import { spinnerSvg } from '../../assets/icons/spinner.js'

// TODOX: --local-color is not define

const svgOptions: Record<IconType, TemplateResult<2>> = {
  apple: appleSvg,
  arrowLeft: arrowLeftSvg,
  arrowRight: arrowRightSvg,
  close: closeSvg,
  help: helpCircleSvg,
  wallet: walletSvg,
  google: googleSvg,
  connect: connectSvg,
  copy: copySvg,
  didit: diditLogoSvg,
  refresh: retrySvg,
  externalLink: externalLinkSvg,
  loading: spinnerSvg
}

@customElement('ui-icon')
export class UiIcon extends LitElement {
  public static override styles = [resetStyles, colorStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public size: SizeType = 'md'

  @property() public name: IconType = 'copy'

  @property() public color?: ColorType

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      ${this.color ? `--local-color: var(--ui-color-${this.color});` : ''}
      --local-width: var(--ui-icon-size-${this.size});
    `

    return html`${svgOptions[this.name]}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon': UiIcon
  }
}
