import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

@customElement('ui-user-card')
export class UiUserCard extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //

  @property() public identifier = ''

  @property() public name?: string

  @property() public picture?: string

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <div class="avatar">${this.templateAvatar()}</div>
      <div class="names">${this.templateNames()}</div>
    `
  }

  // -- Private ------------------------------------------- //

  private templateAvatar() {
    if (this.picture) {
      return html`<ui-image src=${this.picture} size="2xl" alt="user avatar"></ui-image>`
    }

    return html`<ui-icon size="2xl" color="inherit" name="didit"></ui-icon>`
  }

  private templateNames() {
    if (this.name) {
      return html`
        <ui-text variant="title-5" color="foreground">${this.name}</ui-text>
        <ui-text variant="paragraph-2" color="surface-md">${this.identifier}</ui-text>
      `
    }

    return html`<ui-text variant="" color="foreground">${this.identifier}</ui-text>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-user-card': UiUserCard
  }
}
