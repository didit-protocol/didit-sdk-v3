import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { Platform } from '../../types/index.js'
import { ConnectionController } from '../../controllers/index.js'
import { customElement } from '@didit-sdk/ui'

@customElement('didit-connecting-header')
export class DiditConnectingHeader extends LitElement {
  // -- Members ------------------------------------------- //
  private platformTabs: Platform[] = []

  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @property({ type: Array }) public platforms: Platform[] = []

  @property() public onSelectPlatfrom?: (platform: Platform) => void = undefined

  @state() private buffering = false

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectionController.subscribeKey('buffering', val => (this.buffering = val))
    )
  }

  disconnectCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    const tabs = this.generateTabs()

    return html`
      <ui-flex justifyContent="center">
        <ui-tabs
          ?disabled=${this.buffering}
          .tabs=${tabs}
          .onTabChange=${this.onTabChange.bind(this)}
        ></ui-tabs>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private generateTabs() {
    const tabs = this.platforms.map(platform => {
      if (platform === 'browser') {
        return { label: 'Browser', platform: 'browser' } as const
      } else if (platform === 'mobile') {
        return { label: 'Mobile', platform: 'mobile' } as const
      } else if (platform === 'qrcode') {
        return { label: 'Mobile', platform: 'qrcode' } as const
      } else if (platform === 'web') {
        return { label: 'Webapp', platform: 'web' } as const
      } else if (platform === 'desktop') {
        return { label: 'Desktop', platform: 'desktop' } as const
      }

      return { label: 'Browser', platform: 'unsupported' } as const
    })

    this.platformTabs = tabs.map(({ platform }) => platform)

    return tabs
  }

  private onTabChange(index: number) {
    const tab = this.platformTabs[index]
    if (tab) {
      this.onSelectPlatfrom?.(tab)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-connecting-header': DiditConnectingHeader
  }
}
