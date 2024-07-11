import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import styles from './styles.js'

@customElement('didit-help-view')
export class diditHelpView extends LitElement {
  public static override styles = styles

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      --local-color-backgound: ${this.setBaseColorFromEnv()}
    `

    return html`
      <ui-flex class="help-view" .padding=${['2xl', '0', '0', '0']}>
        <ui-flex
          class="help-container"
          flexDirection="column"
          .margin=${['0', 'xxl', '0', 'xxl']}
          gap="l"
        >
          <ui-flex gap="l">
            <div class="icon-box">
              <ui-icon name="card" color="white"></ui-icon>
            </div>
            <ui-flex flexDirection="column" gap="3xs">
              <ui-text variant="title-5" color="foreground">
                Storage and management of payments and information
              </ui-text>
              <ui-text variant="paragraph-2" color="surface-md">
                Digital wallets securely store users payment info, such as credit card numbers, bank
                account details, and cryptocurrency keys.
              </ui-text>
            </ui-flex>
          </ui-flex>
          <ui-flex gap="l">
            <div class="icon-box">
              <ui-icon name="shield" color="white"></ui-icon>
            </div>
            <ui-flex gap="3xs" flexDirection="column">
              <ui-text variant="title-5" color="foreground">
                Convenience and security in transactions
              </ui-text>
              <ui-text variant="paragraph-2" color="surface-md">
                Digital wallets enable quick and convenient transactions both online and in physical
                stores.
              </ui-text>
            </ui-flex>
          </ui-flex>
        </ui-flex>
        <div class="help-background">
          <div class="layer"></div>
          <ui-icon class="tokens" size="" name="tokens"></ui-icon>
        </div>
      </ui-flex>
    `
  }

  // -- Private ------------------------------------------- //

  private hexToRgb(hex: string) {
    let b = 0; let g = 0; let r = 0;
    if (hex.length === 4) {
      const hex1 = hex[1] || '';
      const hex2 = hex[2] || '';
      const hex3 = hex[3] || '';
      r = parseInt(hex1 + hex1, 16);
      g = parseInt(hex2 + hex2, 16);
      b = parseInt(hex3 + hex3, 16);
    } else if (hex.length === 7) {
      const hex1 = hex[1] || '';
      const hex2 = hex[2] || '';
      const hex3 = hex[3] || '';
      const hex4 = hex[4] || '';
      const hex5 = hex[5] || '';
      const hex6 = hex[6] || '';
      r = parseInt(hex1 + hex2, 16);
      g = parseInt(hex3 + hex4, 16);
      b = parseInt(hex5 + hex6, 16);
    }

    return `${r}, ${g}, ${b}`;
  }

  private setBaseColorFromEnv() {
    const baseColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--ui-color-background').trim();
    let rgb = '';
    if (baseColor.startsWith('#')) {
      rgb = this.hexToRgb(baseColor);
    } else if (baseColor.startsWith('rgb')) {
      // eslint-disable-next-line require-unicode-regexp
      rgb = baseColor.match(/\d+/g)?.join(', ') || '';
    }

    return rgb;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'didit-help-view': diditHelpView
  }
}
