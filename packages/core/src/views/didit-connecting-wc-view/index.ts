import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import {
  ConnectionController,
  EventsController,
  NotificationsController,
  RouterController
} from '../../controllers/index.js'
import type { BaseError, Platform } from '../../types/index.js'
import { ConstantsUtil, CoreHelperUtil } from '../../utils/index.js'

@customElement('didit-connecting-wc-view')
export class DiditConnectingWcView extends LitElement {
  // -- Members ------------------------------------------- //
  private interval?: ReturnType<typeof setInterval> = undefined

  private lastRetry = Date.now()

  private wallet = RouterController.state.data?.wallet

  // -- State & Properties -------------------------------- //
  @state() private platform?: Platform = undefined

  @state() private platforms: Platform[] = []

  public constructor() {
    super()
    this.initializeConnection()
    this.interval = setInterval(this.initializeConnection.bind(this), ConstantsUtil.TEN_SEC_MS)
  }

  public override disconnectedCallback() {
    clearTimeout(this.interval)
  }

  // -- Render -------------------------------------------- //
  public override render() {
    if (!this.wallet) {
      return html`<didit-connecting-wc-qrcode ?walletConnect=${true}></didit-connecting-wc-qrcode>`
    }

    this.determinePlatforms()

    return html`
      <ui-flex flexDirection="column" .padding=${['xxl', '0', '0', '0']}>
        ${this.headerTemplate()}
        <div>${this.platformTemplate()}</div>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private async initializeConnection(retry = false) {
    try {
      const { wcPairingExpiry } = ConnectionController.state
      if (retry || CoreHelperUtil.isPairingExpired(wcPairingExpiry)) {
        ConnectionController.connectWalletConnect()
        await ConnectionController.state.wcPromise
        this.finalizeConnection()
        RouterController.push('ConnectingDiditSiwe')
      }
    } catch (error) {
      EventsController.sendEvent({
        type: 'track',
        event: 'CONNECT_ERROR',
        properties: { message: (error as BaseError)?.message ?? 'Unknown' }
      })
      ConnectionController.setWcError(true)
      if (CoreHelperUtil.isAllowedRetry(this.lastRetry)) {
        NotificationsController.showError('Declined')
        this.lastRetry = Date.now()
        this.initializeConnection(true)
      }
    }
  }

  private finalizeConnection() {
    const { wcLinking } = ConnectionController.state

    EventsController.sendEvent({
      type: 'track',
      event: 'CONNECT_SUCCESS',
      properties: {
        method: wcLinking ? 'mobile' : 'qrcode',
        name: this.wallet?.name || 'Unknown'
      }
    })
  }

  private determinePlatforms() {
    if (!this.wallet) {
      throw new Error('didit-connecting-wc-view:determinePlatforms No wallet')
    }

    if (this.platform) {
      return
    }

    const { mobile_link, desktop_link, webapp_link, injected, rdns } = this.wallet
    const injectedIds = injected?.map(({ injected_id }) => injected_id).filter(Boolean) as string[]
    const browserIds = rdns ? [rdns] : injectedIds ?? []
    const isBrowser = browserIds.length
    const isMobileWc = mobile_link
    const isWebWc = webapp_link
    const isBrowserInstalled = ConnectionController.checkInstalled(browserIds)
    const isBrowserWc = isBrowser && isBrowserInstalled
    const isDesktopWc = desktop_link && !CoreHelperUtil.isMobile()

    // Populate all preferences
    if (isBrowserWc) {
      this.platforms.push('browser')
    }
    if (isMobileWc) {
      this.platforms.push(CoreHelperUtil.isMobile() ? 'mobile' : 'qrcode')
    }
    if (isWebWc) {
      this.platforms.push('web')
    }
    if (isDesktopWc) {
      this.platforms.push('desktop')
    }
    if (!isBrowserWc && isBrowser) {
      this.platforms.push('unsupported')
    }

    this.platform = this.platforms[0]
  }

  private platformTemplate() {
    switch (this.platform) {
      case 'browser':
        return html`<didit-connecting-wc-browser></didit-connecting-wc-browser>`
      case 'desktop':
        return html`
          <didit-connecting-wc-desktop .onRetry=${() => this.initializeConnection(true)}>
          </didit-connecting-wc-desktop>
        `
      case 'web':
        return html`
          <didit-connecting-wc-web .onRetry=${() => this.initializeConnection(true)}>
          </didit-connecting-wc-web>
        `
      case 'mobile':
        return html`
          <didit-connecting-wc-mobile isMobile .onRetry=${() => this.initializeConnection(true)}>
          </didit-connecting-wc-mobile>
        `
      case 'qrcode':
        return html`<didit-connecting-wc-qrcode></didit-connecting-wc-qrcode>`
      default:
        return html`<didit-connecting-wc-unsupported></didit-connecting-wc-unsupported>`
    }
  }

  private headerTemplate() {
    const multiPlatform = this.platforms.length > 1

    if (!multiPlatform) {
      return null
    }

    return html`
      <didit-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </didit-connecting-header>
    `
  }

  private async onSelectPlatform(platform: Platform) {
    const container = this.shadowRoot?.querySelector('div')
    if (container) {
      await container.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      }).finished
      this.platform = platform
      container.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease'
      })
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-wc-view': DiditConnectingWcView
  }
}
