import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'
import { AccountController } from '../../controllers/Account.js'
import { RouterController } from '../../controllers/Router.js'
import { NotificationsController } from '../../controllers/Notifications.js'
import { ModalController } from '../../controllers/Modal.js'
import { DiditAuthController } from '../../controllers/DiditAuth.js'
import { ConstantsUtil } from '../../utils/ConstantsUtil.js'

@customElement('didit-connecting-social-view')
export class DiditConnectingSocialView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private socialProvider = DiditAuthController.state.socialProvider

  @state() private popupWindow = DiditAuthController.state.popupWindow

  @state() protected monitorInterval: ReturnType<typeof setInterval> | undefined

  @state() protected error = false

  @state() protected connecting = false

  @state() protected message = 'Connect in the provider window'

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
        DiditAuthController.subscribeKey('popupWindow', val => (this.popupWindow = val))
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
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <wui-flex
        data-error=${ifDefined(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${['3xl', 'xl', 'xl', 'xl'] as const}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${ifDefined(this.socialProvider)}></wui-logo>
          ${this.error ? null : this.loaderTemplate()}
          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100"
            >Log in with
            <span class="capitalize">${this.socialProvider ?? 'Social'}</span></wui-text
          >
          <wui-text align="center" variant="small-400" color=${this.error ? 'error-100' : 'fg-200'}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private loaderTemplate() {
    /*
     * Const borderRadiusMaster = ThemeController.state.themeVariables['--w3m-border-radius-master']
     * BorderRadiusMaster ? parseInt(borderRadiusMaster.replace('px', ''), 10) : 4
     */
    const radius = 4

    return html`<wui-loading-thumbnail radius=${radius * 9}></wui-loading-thumbnail>`
  }

  private handleSocialConnection = async (event: MessageEvent) => {
    if (event.data.source === 'didit-popup') {
      if (event.origin === window.origin) {
        window.removeEventListener('message', this.handleSocialConnection, false)
        try {
          if (this.connecting) {
            return
          }
          this.connecting = true
          this.updateMessage()
          const { code, error, errorDescription } = event.data
          if (error || !code) {
            this.error = true
            this.updateMessage(errorDescription)
          }
          await DiditAuthController.socialSignIn(code)
          this.finalizeConnection()
        } catch (error) {
          this.error = true
          this.updateMessage()
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
    this.updateMessage('Connection timed out')
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
    this.updateMessage('Connection aborted')
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

  private updateMessage(message?: string) {
    if (this.error) {
      this.message = message ?? 'Something went wrong'
    } else if (this.connecting) {
      this.message = 'Retrieving user data'
    } else {
      this.message = 'Connect in the provider window'
    }
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
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-social-view': DiditConnectingSocialView
  }
}
