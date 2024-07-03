import { customElement, UiHelperUtil } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { AccountController, ModalController } from '../../controllers/index.js'
import styles from './styles.js'

@customElement('didit-account-button')
export class DiditAccountButton extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @property({ type: Boolean }) public disabled? = false

  @state() private address = AccountController.state.diditSession?.identifier

  @state() private authMethod? = AccountController.state.diditSession?.identifierType

  // -- Lifecycle ----------------------------------------- //
  public constructor() {
    super()
    this.unsubscribe.push(
      ...[
        AccountController.subscribe(val => {
          if (val.isAuthenticated) {
            this.address = val.diditSession?.identifier
            this.authMethod = val.diditSession?.identifierType
          } else {
            this.address = ''
            this.authMethod = undefined
          }
        })
      ]
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <button
        class="account-button"
        ?disabled=${Boolean(this.disabled)}
        @click=${this.onClick.bind(this)}
        data-testid="didit-account-button"
      >
        <ui-user-card size="md" identifier=${
          this.authMethod === 'email' ? this.address : this.getShortAddress(this.address || '')
        }
        /> </ui-user-card>
      </button>
    `
  }

  // -- Private ------------------------------------------- //

  private getShortAddress(address: string) {
    return UiHelperUtil.getTruncateString({
      string: address,
      charsStart: 4,
      charsEnd: 6,
      truncate: 'middle'
    })
  }

  private onClick() {
    ModalController.open()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-account-button': DiditAccountButton
  }
}
