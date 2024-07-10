export type ThemeType = 'dark' | 'light'

export interface ThemeVariables {
  fontFamily?: string
  fontSizeMaster?: string
  borderRadiusMaster?: string
  primaryColor?: string
  softColor?: string
  backgroundColor?: string
  foregroundColor?: string
  zIndex?: number
}

export type SpacingType =
  | '0'
  | '1xs'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '3xs'
  | '4xs'
  | 'l'
  | '2l'
  | 'm'
  | 's'
  | 'xl'
  | 'xs'
  | 'xxl'
  | 'xxs'

export type BorderRadiusType = Exclude<SpacingType, '1xs' | 'xl' | 'xxl'> | 'xs'

export type SizeType = 'inherit' | 'xl' | 'lg' | 'md' | 'mdl' | 'sm' | 'xs' | 'xxs' | 'xxl'

export type ColorType =
  | 'inherit'
  | 'black'
  | 'white'
  | 'primary'
  | 'soft'
  | 'accent'
  | 'background'
  | 'foreground'
  | 'surface-hi'
  | 'surface-md'
  | 'surface-md-lo'
  | 'surface-lo'
  | 'sureface-u-lo'
  | 'error'
  | 'success'

export type TextType =
  | 'title-1'
  | 'title-2'
  | 'title-3'
  | 'title-4'
  | 'title-5'
  | 'paragraph-1'
  | 'paragraph-2'
  | 'paragraph-3'
  | 'label'
  | 'styled-label'
  | 'button-1'
  | 'button-2'
  | 'link'
  | 'tab-link'

export type TextAlign = 'center' | 'left' | 'right'

export type LineClamp = '1' | '2'

export type FlexDirectionType = 'column-reverse' | 'column' | 'row-reverse' | 'row'

export type FlexWrapType = 'nowrap' | 'wrap-reverse' | 'wrap'

export type FlexBasisType = 'auto' | 'content' | 'fit-content' | 'max-content' | 'min-content'

export type FlexGrowType = '0' | '1'

export type FlexShrinkType = '0' | '1'

export type FlexAlignItemsType = 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch'

export type FlexJustifyContentType =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

export type IconType =
  | 'apple'
  | 'arrowLeft'
  | 'arrowRight'
  | 'connect'
  | 'close'
  | 'google'
  | 'help'
  | 'wallet'
  | 'copy'
  | 'didit'
  | 'refresh'
  | 'externalLink'
  | 'loading'
  | 'profile'
  | 'network'
  | 'logout'
  | 'tokens'
  | 'card'
  | 'shield'

export type TagType = 'default' | 'primary' | 'secondary' | 'error' | 'success'

export type TruncateType = 'start' | 'middle' | 'end'
export type TruncateOptions = {
  string: string
  charsStart: number
  charsEnd: number
  truncate: TruncateType
}
