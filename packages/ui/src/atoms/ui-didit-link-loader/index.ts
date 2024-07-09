import { html, LitElement } from 'lit'
import { colorStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

// -- Gif -------------------------------- //
import { loaderGif } from '../../assets/visuals/loader-gif.js'

@customElement('ui-didit-link-loader')
export class UiDiditLinkLoader extends LitElement {
  public static override styles = [resetStyles, colorStyles, styles]

  // -- Render -------------------------------------------- //
  public override render() {
    return html`<img src=${loaderGif} alt="Loader" />`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-didit-link-loader': UiDiditLinkLoader
  }
}
