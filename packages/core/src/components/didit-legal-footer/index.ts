import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'

@customElement('didit-legal-footer')
export class DiditLegalFooter extends LitElement {
  public static override styles = [styles]

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex .padding=${['m', 's', 's', 's'] as const} justifyContent="center">
        <ui-text color="sureface-md" variant="paragraph-2" align="center">
          scured by Didit
        </ui-text>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-legal-footer': DiditLegalFooter
  }
}
