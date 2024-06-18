import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'

@customElement('didit-legal-footer')
export class DiditLegalFooter extends LitElement {
  public static override styles = [styles]

  // -- Render -------------------------------------------- //
  public override render() {
    const termsConditionsUrl = ''
    const privacyPolicyUrl = ''

    if (!termsConditionsUrl && !privacyPolicyUrl) {
      return null
    }

    return html`
      <wui-flex .padding=${['m', 's', 's', 's'] as const} justifyContent="center">
        <wui-text color="fg-250" variant="small-400" align="center">
          By connecting your wallet, you agree to our <br />
          ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private andTemplate() {
    const termsConditionsUrl = 'TODO: show only didit logo'
    const privacyPolicyUrl = 'TODO: show only didit logo'

    return termsConditionsUrl && privacyPolicyUrl ? 'and' : ''
  }

  private termsTemplate() {
    const termsConditionsUrl = 'TODO: show only didit logo'
    if (!termsConditionsUrl) {
      return null
    }

    return html`<a href=${termsConditionsUrl}>Terms of Service</a>`
  }

  private privacyTemplate() {
    const privacyPolicyUrl = 'TODO: show only didit logo'
    if (!privacyPolicyUrl) {
      return null
    }

    return html`<a href=${privacyPolicyUrl}>Privacy Policy</a>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-legal-footer': DiditLegalFooter
  }
}
