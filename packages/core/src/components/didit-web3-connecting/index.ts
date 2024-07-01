import type { IconType } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'
import { RouterController } from '../../controllers/Router.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { ConnectionController } from '../../controllers/Connection.js'
import { NotificationsController } from '../../controllers/Notifications.js'
import { DiditApiController } from '../../controllers/DiditApi.js'

export class DiditWeb3Connecting extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  protected readonly wallet = RouterController.state.data?.wallet

  protected readonly connector = RouterController.state.data?.connector

  protected timeout?: ReturnType<typeof setTimeout> = undefined

  protected secondaryBtnLabel = 'Try again'

  protected secondaryBtnIcon: IconType = 'refresh'

  protected secondaryLabel = 'Accept connection request in the wallet'

  protected onConnect?: (() => void) | (() => Promise<void>) = undefined

  protected onRender?: (() => void) | (() => Promise<void>) = undefined

  protected onAutoConnect?: (() => void) | (() => Promise<void>) = undefined

  protected show = true

  private unsubscribe: (() => void)[] = []

  private imageSrc = this.wallet?.image_url ?? this.connector?.imageUrl

  private name = this.wallet?.name ?? this.connector?.name ?? 'Wallet'

  private isRetrying = false

  // -- State & Properties -------------------------------- //
  @state() protected uri = ConnectionController.state.wcUri

  @state() protected error = ConnectionController.state.wcError

  @state() protected ready = false

  @state() private showRetry = false

  @state() public buffering = false

  @property({ type: Boolean }) public isMobile = false

  @property() public onRetry?: (() => void) | (() => Promise<void>) = undefined

  public constructor() {
    super()
    this.unsubscribe.push(
      ...[
        ConnectionController.subscribeKey('wcUri', val => {
          this.uri = val
          if (this.isRetrying && this.onRetry) {
            this.isRetrying = false
            this.onConnect?.()
          }
        }),
        ConnectionController.subscribeKey('wcError', val => (this.error = val)),
        ConnectionController.subscribeKey('buffering', val => (this.buffering = val))
      ]
    )
  }

  public override firstUpdated() {
    this.onAutoConnect?.()
    this.showRetry = !this.onAutoConnect
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
    clearTimeout(this.timeout)
  }

  // -- Render -------------------------------------------- //
  public override render() {
    this.onRender?.()
    this.onShowRetry()

    const subLabel = this.error
      ? 'Connection can be declined if a previous request is still active'
      : this.secondaryLabel

    let label = `Continue in ${this.name}`

    if (this.buffering) {
      label = 'Connecting...'
    }

    if (this.error) {
      label = 'Connection declined'
    }

    if (
      this.connector &&
      CoreHelperUtil.isWeb3Connector(this.connector) &&
      this.connector.imageId
    ) {
      this.imageSrc = DiditApiController.getConnectorImageUrl(this.connector.imageId)
    }

    return html`
      <ui-flex
        .padding=${['3xl', '0', '0', '0']}
        data-error=${ifDefined(this.error)}
        data-retry=${this.showRetry}
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
          <ui-flex class="connector-logo" justifyContent="center" alignItems="center">
            <ui-wallet-image
              size="xl"
              ?withPadding=${true}
              imageSrc=${ifDefined(this.imageSrc)}
            ></ui-wallet-image>
          </ui-flex>
          <ui-flex flexDirection="column" alignItems="center" gap="s">
            <ui-text variant="title-4" color=${this.error ? 'error' : 'foreground'}>
              ${label}
            </ui-text>
            <ui-text align="center" variant="paragraph-1" color="surface-md">${subLabel}</ui-text>
          </ui-flex>
        </ui-flex>
        <ui-flex class="buttons-container" flexDirection="column" alignItems="center" gap="xxl">
          ${this.refreshButtonTemplate()}
          ${html`<didit-mobile-download-links
            .wallet=${this.wallet}
          ></didit-mobile-download-links>`}
          ${this.openLinkButtonTemplate()}
        </ui-flex>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private refreshButtonTemplate() {
    if (this.secondaryBtnIcon === 'refresh') {
      return html`
        <ui-link
          class="retry-button"
          icon=${this.secondaryBtnIcon}
          ?hasIconLeft=${true}
          ?disabled=${!this.error && this.buffering}
          @click=${this.onTryAgain.bind(this)}
        >
          ${this.secondaryBtnLabel}
        </ui-link>
      `
    }

    return null
  }

  private openLinkButtonTemplate() {
    if (this.secondaryBtnIcon === 'externalLink') {
      return html`
        <ui-button
          class="open-link-button"
          variant="primary"
          text=${this.secondaryBtnLabel}
          icon=${this.secondaryBtnIcon}
          data-testid=${`open-link-button`}
          ?fullWidth=${true}
          @click=${this.onTryAgain.bind(this)}
        ></ui-button>
      `
    }

    return null
  }

  private onShowRetry() {
    if (this.error && !this.showRetry) {
      this.showRetry = true
      const retryButton = this.shadowRoot?.querySelector('ui-link')
      retryButton?.animate([{ opacity: 0 }, { opacity: 1 }], {
        fill: 'forwards',
        easing: 'ease'
      })
    }
  }

  private onTryAgain() {
    if (!this.buffering) {
      ConnectionController.setWcError(false)
      if (this.onRetry) {
        this.isRetrying = true
        this.onRetry?.()
      } else {
        this.onConnect?.()
      }
    }
  }

  // -- Protected ----------------------------------------- //
  protected onCopyUri() {
    try {
      if (this.uri) {
        CoreHelperUtil.copyToClopboard(this.uri)
        NotificationsController.showSuccess('Link copied')
      }
    } catch {
      NotificationsController.showError('Failed to copy')
    }
  }
}
