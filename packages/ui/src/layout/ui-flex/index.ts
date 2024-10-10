import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { resetStyles } from '../../utils/ThemeUtil.js'
import type {
  FlexAlignItemsType,
  FlexBasisType,
  FlexDirectionType,
  FlexGrowType,
  FlexJustifyContentType,
  FlexShrinkType,
  FlexWrapType,
  SpacingType
} from '../../utils/TypeUtil.js'
import { UiHelperUtil } from '../../utils/UiHelperUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'

@customElement('ui-flex')
export class UiFlex extends LitElement {
  public static override styles = [resetStyles, styles]

  // -- State & Properties -------------------------------- //
  @property({ attribute: 'custom-style' })
  public customStyle?: string

  @property() public flexDirection?: FlexDirectionType

  @property() public flexWrap?: FlexWrapType

  @property() public flexBasis?: FlexBasisType

  @property() public flexGrow?: FlexGrowType

  @property() public flexShrink?: FlexShrinkType

  @property() public alignItems?: FlexAlignItemsType

  @property() public justifyContent?: FlexJustifyContentType

  @property() public columnGap?: SpacingType

  @property() public rowGap?: SpacingType

  @property() public gap?: SpacingType

  @property() public padding?: SpacingType | SpacingType[]

  @property() public margin?: SpacingType | SpacingType[]

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap && `var(--ui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap && `var(--ui-spacing-${this.rowGap})`};
      gap: ${this.gap && `var(--ui-spacing-${this.gap})`};
      padding-top: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 0)};
      padding-right: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 1)};
      padding-bottom: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 2)};
      padding-left: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 3)};
      margin-top: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 0)};
      margin-right: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 1)};
      margin-bottom: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 2)};
      margin-left: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 3)};
    `
    if (this.customStyle) {
      const customStyle = JSON.parse(this.customStyle)

      const customStyleString = Object.keys(customStyle).reduce((acc, key) => {
        const cssKey = key.replace(/[A-Z]/gu, m => `-${m.toLowerCase()}`)

        return `${acc}${acc ? '; ' : ''}${cssKey}: ${customStyle[key]}`
      }, '')

      if (customStyleString) {
        this.style.cssText += this.style.cssText ? `; ${customStyleString}` : customStyleString
      }
    }

    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-flex': UiFlex
  }
}
