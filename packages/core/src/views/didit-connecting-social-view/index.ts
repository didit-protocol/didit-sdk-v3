import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { AccountController } from '../../controllers/Account.js'
import { RouterController } from '../../controllers/Router.js'
import { NotificationsController } from '../../controllers/Notifications.js'
import { ModalController } from '../../controllers/Modal.js'
import { DiditAuthController } from '../../controllers/DiditAuth.js'
import { ConstantsUtil } from '../../utils/ConstantsUtil.js'
import styles from './styles.js'

@customElement('didit-connecting-social-view')
export class DiditConnectingSocialView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private socialProvider = DiditAuthController.state.socialProvider

  @state() private popupWindow = DiditAuthController.state.popupWindow

  @state() protected monitorInterval: ReturnType<typeof setInterval> | undefined

  @state() protected label = `Continue with ${this.socialProvider ?? 'Social'}`

  @state() protected subLabel = 'Login using the provider window'

  @state() protected error = false

  @state() protected connecting = false

  @state() private showRetry = false

  @state() protected timeOut: ReturnType<typeof setTimeout> | undefined

  public socailConnector = RouterController.state.data?.connector

  public constructor() {
    super()
    this.unsubscribe.push(
      ...[
        AccountController.subscribe(val => {
          if (val.walletAddress) {
            if (ModalController.state.open) {
              ModalController.close()
            }
          }
        }),
        DiditAuthController.subscribeKey('socialProvider', val => (this.socialProvider = val)),
        DiditAuthController.subscribeKey('popupWindow', val => {
          this.popupWindow = val
          if (val) {
            this.monitorPopupStatus()
          }
        })
      ]
    )
    if (this.socailConnector) {
      this.connectSocial()
    }

    if (this.popupWindow) {
      this.monitorPopupStatus()
    }
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
    this.stopMonitoringPopupStatus()
    DiditAuthController.resetSocialData()
  }

  // -- Render -------------------------------------------- //
  public override render() {
    this.onShowRetry()

    return html`
      <ui-flex
        .padding=${['3xl', '0', '0', '0']}
        data-error=${ifDefined(this.error)}
        data-retry=${ifDefined(this.showRetry)}
        flexDirection="column"
        alignItems="center"
        gap="3xl"
      >
        <ui-flex
          flexDirection="column"
          alignItems="center"
          .padding=${['xl', '0', 'xl', '0']}
          gap="xxl"
        >
          <ui-didit-link
            connectorIcon=${this.socialProvider}
            ?loading=${!this.error}
            ?logoBouncing=${this.error}
          >
          </ui-didit-link>
          <ui-flex flexDirection="column" alignItems="center" gap="s">
            <ui-text variant="title-4" color=${this.error ? 'error' : 'foreground'}>
              ${this.label}
            </ui-text>
            <ui-text align="center" variant="paragraph-1" color="surface-md"
              >${this.subLabel}</ui-text
            >
          </ui-flex>
        </ui-flex>
        <ui-flex class="buttons-container" flexDirection="column" alignItems="center" gap="xxl">
          ${this.refreshButtonTemplate()}
        </ui-flex>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private refreshButtonTemplate() {
    return html`
      <ui-link
        class="retry-button"
        icon="refresh"
        ?hasIconLeft=${true}
        ?disabled=${!this.error || this.connecting}
        @click=${this.onTryAgain.bind(this)}
      >
        Try again
      </ui-link>
    `
  }

  private onTryAgain() {
    RouterController.goBack()
  }

  private handleSocialConnection = async (event: MessageEvent) => {
    if (event.data.source === 'didit-popup') {
      if (event.origin === window.origin) {
        window.removeEventListener('message', this.handleSocialConnection, false)
        try {
          if (this.connecting) {
            return
          }
          this.error = false
          this.connecting = true
          this.label = 'Connecting to Didit'
          this.subLabel = 'Please wait...'
          const { code, error, errorDescription } = event.data
          if (error || !code) {
            this.error = true
            this.label = error ?? 'Connection failed'
            this.subLabel = errorDescription ?? 'Something went wrong! Please try again'
          }
          await DiditAuthController.socialSignIn(code)
          this.finalizeConnection()
        } catch (error) {
          this.error = true
          this.label = 'Connection failed'
          this.subLabel = 'Something went wrong! Please try again'
        }
        if (this.timeOut) {
          clearTimeout(this.timeOut)
        }
      } else {
        RouterController.goBack()
        NotificationsController.showError('Untrusted Origin')
      }
    }
  }

  private handleTimeout() {
    this.error = true
    this.label = 'Connection timeout'
    this.subLabel = 'Connection failed! Please try again'
    DiditAuthController.resetSocialData()
  }

  private connectSocial() {
    window.addEventListener(
      'message',
      event => {
        this.handleSocialConnection(event)
      },
      false
    )
    const to = setTimeout(() => {
      this.handleTimeout()
    }, ConstantsUtil.TWO_MINUTES_MS)
    this.timeOut = to
  }

  private handlePopupWindowClose() {
    this.error = true
    this.label = 'Connection declined'
    this.subLabel = 'Connection failed! Please try again'
    DiditAuthController.resetSocialData()
  }

  private finalizeConnection() {
    this.error = false
    this.stopMonitoringPopupStatus()
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
    if (this.popupWindow && !this.popupWindow.closed) {
      this.popupWindow.close()
    }
    DiditAuthController.deleteCodeVerifier()
    ModalController.close()
  }

  private monitorPopupStatus() {
    if (this.monitorInterval) {
      return
    }

    this.monitorInterval = setInterval(() => {
      if (this.popupWindow?.closed) {
        this.handlePopupWindowClose()
        this.stopMonitoringPopupStatus()
      }
    }, 1000)
  }

  private stopMonitoringPopupStatus() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
      this.monitorInterval = undefined
    }
  }

  private onShowRetry() {
    if (this.error && !this.showRetry) {
      this.showRetry = true
      const retryButton = this.shadowRoot?.querySelector('ui-link') as HTMLElement
      retryButton?.animate([{ opacity: 0 }, { opacity: 1 }], {
        fill: 'forwards',
        easing: 'ease'
      })
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-social-view': DiditConnectingSocialView
  }
}
