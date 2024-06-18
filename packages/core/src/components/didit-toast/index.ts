import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import { NotificationsController } from '../../controllers/Notifications.js'

// -- Helpers ------------------------------------------- //
const presets = {
  loading: undefined,
  success: {
    backgroundColor: 'success-100',
    iconColor: 'success-100',
    icon: 'checkmark'
  },
  error: {
    backgroundColor: 'error-100',
    iconColor: 'error-100',
    icon: 'close'
  }
} as const

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
    const preset = presets[variant]

    return html`
      <div style="border: 1px solid ${preset.backgroundColor}">
        <span>message: ${message}</span>
        <span>variant: ${variant}</span>
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
