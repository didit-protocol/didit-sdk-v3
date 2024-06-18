import { customElement, initializeTheming } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import { ModalController } from '../../controllers/Modal.js'
import { AccountController } from '../../controllers/Account.js'
import { EventsController } from '../../controllers/Events.js'
import { DiditAuthController } from '../../controllers/DiditAuth.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { NotificationsController } from '../../controllers/Notifications.js'
import { RouterController } from '../../controllers/Router.js'

// -- Helpers --------------------------------------------- //
const SCROLL_LOCK = 'scroll-lock'

@customElement('w3m-modal')
export class W3mModal extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  private abortController?: AbortController = undefined

  // -- State & Properties -------------------------------- //
  @state() private open = ModalController.state.open

  @state() private address = AccountController.state.walletAddress

  @state() private authenticated = AccountController.state.isAuthenticated

  @state() private diditSession = AccountController.state.diditSession

  @state() private connected = AccountController.state.isWalletConnected

  @state() private loading = ModalController.state.loading

  public constructor() {
    super()
    this.initializeTheming()
    this.unsubscribe.push(
      ModalController.subscribeKey('open', val => (val ? this.onOpen() : this.onClose())),
      ModalController.subscribeKey('loading', val => {
        this.loading = val
        this.onNewAddress(AccountController.state.walletAddress)
      }),
      AccountController.subscribeKey('isAuthenticated', val => (this.authenticated = val)),
      AccountController.subscribeKey('isWalletConnected', val => (this.connected = val)),
      AccountController.subscribeKey('walletAddress', val => this.onNewAddress(val)),
      AccountController.subscribeKey('diditSession', val => (this.diditSession = val))
    )
    EventsController.sendEvent({ type: 'track', event: 'MODAL_LOADED' })
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
    this.onRemoveKeyboardListener()
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return this.open
      ? html`
          <wui-flex @click=${this.onOverlayClick.bind(this)}>
            <wui-card role="alertdialog" aria-modal="true" tabindex="0">
              <didit-header></didit-header>
              <didit-router></didit-router>
              <didit-toast></didit-toast>
            </wui-card>
          </wui-flex>
        `
      : null
  }

  // -- Private ------------------------------------------- //
  private onOverlayClick(event: PointerEvent) {
    if (event.target === event.currentTarget) {
      this.handleClose()
    }
  }

  private async handleClose() {
    if (DiditAuthController.state.status !== 'success') {
      await ConnectionController.disconnect()
    }

    ModalController.close()
  }

  private initializeTheming() {
    initializeTheming()
  }

  private onClose() {
    this.open = false
    this.classList.remove('open')
    this.onScrollUnlock()
    NotificationsController.hide()
    this.onRemoveKeyboardListener()
  }

  private onOpen() {
    this.open = true
    this.classList.add('open')
    this.onScrollLock()
    this.onAddKeyboardListener()
  }

  private onScrollLock() {
    const styleTag = document.createElement('style')
    styleTag.dataset['w3m'] = SCROLL_LOCK
    styleTag.textContent = `
      html, body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `
    document.head.appendChild(styleTag)
  }

  private onScrollUnlock() {
    const styleTag = document.head.querySelector(`style[data-w3m="${SCROLL_LOCK}"]`)
    if (styleTag) {
      styleTag.remove()
    }
  }

  private onAddKeyboardListener() {
    this.abortController = new AbortController()
    const card = this.shadowRoot?.querySelector('wui-card')
    card?.focus()
    window.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape') {
          this.handleClose()
        } else if (event.key === 'Tab') {
          const { tagName } = event.target as HTMLElement
          if (tagName && !tagName.includes('W3M-') && !tagName.includes('WUI-')) {
            card?.focus()
          }
        }
      },
      this.abortController
    )
  }

  private onRemoveKeyboardListener() {
    this.abortController?.abort()
    this.abortController = undefined
  }

  private async onNewAddress(newAddress?: string) {
    if (!this.connected || this.loading) {
      return
    }
    const previousAddress = this.address
    this.address = newAddress
    /*
     * If the address has changed and user is signed in with wallet, sign out
     * TODOX: get user session from the server for the first render
     */
    const isAuthWithWallet =
      this.authenticated && this.diditSession?.identifierType === 'wallet_address'
    if (isAuthWithWallet && previousAddress && newAddress && previousAddress !== newAddress) {
      await DiditAuthController.signOut()
      this.onSiweNavigation()
    }
  }

  private onSiweNavigation() {
    if (this.open) {
      RouterController.push('ConnectingDiditSiwe')
    } else {
      ModalController.open()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-modal': W3mModal
  }
}
