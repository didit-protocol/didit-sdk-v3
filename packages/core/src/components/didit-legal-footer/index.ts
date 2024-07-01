import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'

@customElement('didit-legal-footer')
export class DiditLegalFooter extends LitElement {
  public static override styles = [styles]

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <wui-flex .padding=${['m', 's', 's', 's'] as const} justifyContent="center">
        <wui-text color="fg-250" variant="small-400" align="center"> scured by Didit </wui-text>
      </wui-flex>
    `
  }

  // -- Private ------------------------------------------- //
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-legal-footer': DiditLegalFooter
  }
}
