import { UiHelperUtil, customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import styles from './styles.js'
import type { WcWallet } from '../../types/web3.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { RouterController } from '../../controllers/Router.js'

@customElement('didit-mobile-download-links')
export class DiditMobileDownloadLinks extends LitElement {
  public static override styles = [styles]

  // -- State & Properties -------------------------------- //
  @property({ type: Object }) wallet?: WcWallet = undefined

  // -- Render -------------------------------------------- //
  public override render() {
    if (!this.wallet) {
      this.style.display = 'none'

      return null
    }
    const { name, app_store, play_store, chrome_store, homepage } = this.wallet
    const isMobile = CoreHelperUtil.isMobile()
    const isIos = CoreHelperUtil.isIos()
    const isAndroid = CoreHelperUtil.isAndroid()
    const isMultiple = [app_store, play_store, homepage, chrome_store].filter(Boolean).length > 1
    const shortName = UiHelperUtil.getTruncateString({
      string: name,
      charsStart: 12,
      charsEnd: 0,
      truncate: 'end'
    })

    if (isMultiple && !isMobile) {
      return html`
        <wui-cta-button
          label=${`Don't have ${shortName}?`}
          buttonLabel="Get"
          @click=${() => RouterController.push('Downloads', { wallet: this.wallet })}
        ></wui-cta-button>
      `
    }

    if (!isMultiple && homepage) {
      return html`
        <wui-cta-button
          label=${`Don't have ${shortName}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `
    }

    if (app_store && isIos) {
      return html`
        <wui-cta-button
          label=${`Don't have ${shortName}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `
    }

    if (play_store && isAndroid) {
      return html`
        <wui-cta-button
          label=${`Don't have ${shortName}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `
    }

    this.style.display = 'none'

    return null
  }

  // -- Private ------------------------------------------- //
  private onAppStore() {
    if (this.wallet?.app_store) {
      CoreHelperUtil.openHref(this.wallet.app_store, '_blank')
    }
  }

  private onPlayStore() {
    if (this.wallet?.play_store) {
      CoreHelperUtil.openHref(this.wallet.play_store, '_blank')
    }
  }

  private onHomePage() {
    if (this.wallet?.homepage) {
      CoreHelperUtil.openHref(this.wallet.homepage, '_blank')
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-mobile-download-links': DiditMobileDownloadLinks
  }
}
