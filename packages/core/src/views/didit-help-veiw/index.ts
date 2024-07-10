import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'

@customElement('didit-help-view')
export class diditHelpView extends LitElement {
  public static override styles = styles

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <ui-flex class="help-view" .padding=${['2xl', '0', '0', '0']}>
        <ui-flex
          class="help-container"
          flexDirection="column"
          .margin=${['0', 'xxl', '0', 'xxl']}
          gap="l"
        >
          <ui-flex gap="l">
            <div class="icon-box">
              <ui-icon name="card" color="background"></ui-icon>
            </div>
            <ui-flex flexDirection="column" gap="3xs">
              <ui-text variant="title-5" color="foreground">
                Storage and management of payments and information
              </ui-text>
              <ui-text variant="paragraph-2" color="surface-md">
                Digital wallets securely store users payment info, such as credit card numbers, bank
                account details, and cryptocurrency keys.
              </ui-text>
            </ui-flex>
          </ui-flex>
          <ui-flex gap="l">
            <div class="icon-box">
              <ui-icon name="shield" color="background"></ui-icon>
            </div>
            <ui-flex gap="3xs" flexDirection="column">
              <ui-text variant="title-5" color="foreground">
                Convenience and security in transactions
              </ui-text>
              <ui-text variant="paragraph-2" color="surface-md">
                Digital wallets enable quick and convenient transactions both online and in physical
                stores.
              </ui-text>
            </ui-flex>
          </ui-flex>
        </ui-flex>
        <div class="help-background">
          <ui-icon class="tokens" size="" name="tokens"></ui-icon>
        </div>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-help-view': diditHelpView
  }
}
