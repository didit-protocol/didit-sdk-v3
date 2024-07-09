import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import styles from './styles.js'
import type { WcWallet } from '../../types/web3.js'
import { CoreHelperUtil } from '../../utils/CoreHelperUtil.js'
import { customElement, UiHelperUtil } from '@didit-sdk/ui'

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
    const { name, app_store, play_store, chrome_store, homepage, firefox_store } = this.wallet
    const hasLink =
      [app_store, play_store, homepage, chrome_store, firefox_store].filter(Boolean).length > 0
    const shortName = UiHelperUtil.getTruncateString({
      string: name,
      charsStart: 12,
      charsEnd: 0,
      truncate: 'end'
    })

    if (hasLink) {
      return html`
        <ui-flex justifyContent="center" alignItems="center" gap="m">
          <ui-text variant="paragraph-1" color="surface-md">${`Don't have ${shortName}?`}</ui-text>
          <ui-link @click=${this.handleDownloadLink.bind(this)}> Get it </ui-link>
        </ui-flex>
      `
    }

    this.style.display = 'none'

    return null
  }

  // -- Private ------------------------------------------- //

  private handleDownloadLink() {
    if (!this.wallet) {
      return
    }
    const { app_store, play_store, chrome_store, homepage, firefox_store } = this.wallet
    const isIos = CoreHelperUtil.isIos()
    const isAndroid = CoreHelperUtil.isAndroid()

    if (app_store && isIos) {
      this.onAppStore()
    } else if (play_store && isAndroid) {
      this.onPlayStore()
    } else if (chrome_store) {
      this.onChromeStore()
    } else if (firefox_store) {
      this.onFirefoxStore()
    } else if (homepage) {
      this.onHomePage()
    }
  }

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

  private onChromeStore() {
    if (this.wallet?.chrome_store) {
      CoreHelperUtil.openHref(this.wallet.chrome_store, '_blank')
    }
  }

  private onFirefoxStore() {
    if (this.wallet?.firefox_store) {
      CoreHelperUtil.openHref(this.wallet.firefox_store, '_blank')
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-mobile-download-links': DiditMobileDownloadLinks
  }
}
