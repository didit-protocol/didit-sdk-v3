/* eslint-disable no-bitwise */
import type { SpacingType, TruncateOptions } from './TypeUtil.js'

export const UiHelperUtil = {
  getSpacingStyles(spacing: SpacingType | SpacingType[], index: number) {
    if (Array.isArray(spacing)) {
      return spacing[index] ? `var(--ui-spacing-${spacing[index]})` : undefined
    } else if (typeof spacing === 'string') {
      return `var(--ui-spacing-${spacing})`
    }

    return undefined
  },

  getTruncateString({ string, charsStart, charsEnd, truncate }: TruncateOptions) {
    if (string.length <= charsStart + charsEnd) {
      return string
    }

    if (truncate === 'end') {
      return `${string.substring(0, charsStart)}...`
    } else if (truncate === 'start') {
      return `...${string.substring(string.length - charsEnd)}`
    }

    return `${string.substring(0, Math.floor(charsStart))}...${string.substring(
      string.length - Math.floor(charsEnd)
    )}`
  }
}
