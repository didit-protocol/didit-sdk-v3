import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import { NotificationsController } from '../../controllers/Notifications.js'

@customElement('didit-toast')
export class DiditToast extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  private timeout?: ReturnType<typeof setTimeout> = undefined

  // -- State & Properties -------------------------------- //
  @state() private open = NotificationsController.state.open

  public constructor() {
    super()
    this.onOpen()
    this.unsubscribe.push(
      NotificationsController.subscribeKey('open', val => {
        this.open = val
        this.onOpen()
      })
    )
  }

  public override disconnectedCallback() {
    clearTimeout(this.timeout)
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    const { message, variant } = NotificationsController.state

    return html`
      <div data-variant=${variant}>
        <div class="toast-bar"></div>
        <div>
          <ui-text variant="header-4" color="foreground">${message}</ui-text>
        </div>
      </div>
    `
  }

  // -- Private ------------------------------------------- //
  private onOpen() {
    clearTimeout(this.timeout)
    if (this.open) {
      this.animate(
        [
          { opacity: 0, transform: 'translateX(-50%) scale(0.85)' },
          { opacity: 1, transform: 'translateX(-50%) scale(1)' }
        ],
        {
          duration: 150,
          fill: 'forwards',
          easing: 'ease'
        }
      )
      this.timeout = setTimeout(() => NotificationsController.hide(), 2500)
    } else {
      this.animate(
        [
          { opacity: 1, transform: 'translateX(-50%) scale(1)' },
          { opacity: 0, transform: 'translateX(-50%) scale(0.85)' }
        ],
        {
          duration: 150,
          fill: 'forwards',
          easing: 'ease'
        }
      )
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-toast': DiditToast
  }
}
