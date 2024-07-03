import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { customElement } from '@didit-sdk/ui'
import { AccountController } from '../../controllers/Account.js'
import { ModalController } from '../../controllers/Modal.js'
import styles from './styles.js'

@customElement('didit-button')
export class DiditButton extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @property({ type: Boolean }) public disabled? = false

  @property() public label?: string = 'Sign in'

  @property() public loadingLabel?: string = 'Connecting...'

  @state() private isAccount = AccountController.state.isAuthenticated

  @state() private isLoading = ModalController.state.loading

  @state() private open = ModalController.state.open

  // -- Lifecycle ----------------------------------------- //
  public constructor() {
    super()
    this.unsubscribe.push(
      AccountController.subscribeKey('isAuthenticated', val => {
        this.isAccount = val
      }),

      ModalController.subscribe(val => {
        this.isLoading = val.loading
        this.open = val.open
      })
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    if (this.isAccount === undefined) {
      return null
    }

    return this.isAccount && !this.isLoading
      ? html` <didit-account-button .disabled=${Boolean(this.disabled)}> </didit-account-button> `
      : html`
          <ui-button
            ?loading=${this.isLoading}
            variant="primary"
            icon="connect"
            @click=${this.onClick.bind(this)}
            data-testid="didit-connect-button"
          >
            ${this.isLoading ? this.loadingLabel : this.label}
          </ui-button>
        `
  }

  // -- Private ------------------------------------------- //
  private onClick() {
    if (this.open) {
      ModalController.close()
    } else if (!this.isLoading) {
      ModalController.open()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-button': DiditButton
  }
}
