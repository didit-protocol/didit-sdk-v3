import { css, unsafeCSS } from 'lit'
import type { ThemeVariables, ThemeType } from './TypeUtil.js'

// -- Utilities ---------------------------------------------------------------
let themeTag: HTMLStyleElement | undefined = undefined
let darkModeTag: HTMLStyleElement | undefined = undefined
let lightModeTag: HTMLStyleElement | undefined = undefined

export function initializeTheming(themeVariables?: ThemeVariables, themeMode?: ThemeType) {
  themeTag = document.createElement('style')
  darkModeTag = document.createElement('style')
  lightModeTag = document.createElement('style')
  themeTag.textContent = createRootStyles(themeVariables).core.cssText
  darkModeTag.textContent = createRootStyles(themeVariables).dark.cssText
  lightModeTag.textContent = createRootStyles(themeVariables).light.cssText
  document.head.appendChild(themeTag)
  document.head.appendChild(darkModeTag)
  document.head.appendChild(lightModeTag)
  setColorTheme(themeMode)
}

export function setColorTheme(themeMode?: string) {
  if (darkModeTag && lightModeTag) {
    if (themeMode === 'light') {
      lightModeTag.removeAttribute('media')
      darkModeTag.media = 'enabled'
    } else {
      darkModeTag.removeAttribute('media')
      lightModeTag.media = 'enabled'
    }
  }
}

export function setThemeVariables(themeVariables: ThemeVariables) {
  if (themeTag && darkModeTag && lightModeTag) {
    themeTag.textContent = createRootStyles(themeVariables).core.cssText
    darkModeTag.textContent = createRootStyles(themeVariables).dark.cssText
    lightModeTag.textContent = createRootStyles(themeVariables).light.cssText
  }
}

const diditColorScheme = {
  light: {
    primary: '#2667FF',
    soft: '#E8EAF8',
    black: '#1A1A1A',
    white: '#FEFEFE',
    sufaceHi: '#4B5058',
    sufaceMd: '#9DA1A1',
    sufaceMdLo: '#C4C7C7',
    surfaceLo: '#F4F4F6',
    surfaceULo: '#F8F8F8',
    systemSuccess: '#41D97F',
    systemError: '#FF4141'
  },
  dark: {
    primary: '#2667FF',
    soft: '#E8EAF8',
    black: '#1A1A1A',
    white: '#FEFEFE',
    sufaceHi: '#4B5058',
    sufaceMd: '#9DA1A1',
    sufaceMdLo: '#C4C7C7',
    surfaceLo: '#2F2F2F',
    surfaceULo: 'rgba(248, 248, 248, 0.05)',
    systemSuccess: '#41D97F',
    systemError: '#FF4141'
  }
}

const diditFontFamily = '"Roboto", sans-serif'

function getDiditThemeVariables(themeVariables?: ThemeVariables, themeType?: ThemeType) {
  if (themeType === 'light') {
    return {
      '--dui-primary': themeVariables?.primaryColor || diditColorScheme.light.primary,
      '--dui-soft': themeVariables?.softColor || diditColorScheme.light.soft,
      '--dui-background': themeVariables?.backgroundColor || diditColorScheme.light.white,
      '--dui-foreground': themeVariables?.foregroundColor || diditColorScheme.light.black,
      '--dui-black': diditColorScheme.light.black,
      '--dui-white': diditColorScheme.light.white
    }
  }

  return {
    '--dui-primary': themeVariables?.primaryColor || diditColorScheme.dark.primary,
    '--dui-soft': themeVariables?.softColor || diditColorScheme.dark.soft,
    '--dui-background': themeVariables?.backgroundColor || diditColorScheme.dark.black,
    '--dui-foreground': themeVariables?.foregroundColor || diditColorScheme.dark.white,
    '--dui-black': diditColorScheme.dark.black,
    '--dui-white': diditColorScheme.dark.white
  }
}

function createRootStyles(themeVariables?: ThemeVariables) {
  return {
    core: css`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap');
      :root {
        --dui-modal-width: 400px;
        --dui-font-family: ${unsafeCSS(themeVariables?.fontFamily || diditFontFamily)};
        --dui-font-size-master: ${unsafeCSS(themeVariables?.fontSizeMaster || '10px')};
        --dui-border-radius-master: ${unsafeCSS(themeVariables?.borderRadiusMaster || '4px')};
        --dui-z-index: ${unsafeCSS(themeVariables?.zIndex || 999)};

        --ui-font-family: var(--dui-font-family);

        --ui-z-index: var(--dui-z-index);

        --ui-modal-width: var(--dui-modal-width);

        --ui-font-size-mini: calc(var(--dui-font-size-master) * 0.8);
        --ui-font-size-micro: var(--dui-font-size-master);
        --ui-font-size-tiny: calc(var(--dui-font-size-master) * 1.1);
        --ui-font-size-smaller: calc(var(--dui-font-size-master) * 1.2);
        --ui-font-size-smallx: calc(var(--dui-font-size-master) * 1.3);
        --ui-font-size-small: calc(var(--dui-font-size-master) * 1.4);
        --ui-font-size-smallm: calc(var(--dui-font-size-master) * 1.5);
        --ui-font-size-paragraph: calc(var(--dui-font-size-master) * 1.6);
        --ui-font-size-medium: calc(var(--dui-font-size-master) * 2.2);
        --ui-font-size-large: calc(var(--dui-font-size-master) * 3.2);
        --ui-font-size-xl: calc(var(--dui-font-size-master) * 4.2);
        --ui-font-size-2xl: calc(var(--dui-font-size-master) * 5.2);

        --ui-font-weight-light: 400;
        --ui-font-weight-regular: 500;
        --ui-font-weight-medium: 600;
        --ui-font-weight-bold: 700;

        --ui-border-radius-5xs: var(--dui-border-radius-master);
        --ui-border-radius-4xs: calc(var(--dui-border-radius-master) * 1.5);
        --ui-border-radius-3xs: calc(var(--dui-border-radius-master) * 2);
        --ui-border-radius-xxs: calc(var(--dui-border-radius-master) * 3);
        --ui-border-radius-xs: calc(var(--dui-border-radius-master) * 4);
        --ui-border-radius-s: calc(var(--dui-border-radius-master) * 5);
        --ui-border-radius-m: calc(var(--dui-border-radius-master) * 6);
        --ui-border-radius-l: calc(var(--dui-border-radius-master) * 7);
        --ui-border-radius-xl: calc(var(--dui-border-radius-master) * 8);
        --ui-border-radius-2xl: calc(var(--dui-border-radius-master) * 9);

        --ui-letter-spacing-2xl: -1.26px;
        --ui-letter-spacing-xl: -0.96px;
        --ui-letter-spacing-large: -0.72px;
        --ui-letter-spacing-medium: -0.45px;
        --ui-letter-spacing-paragraph: -0.36px;
        --ui-letter-spacing-small: -0.24px;
        --ui-letter-spacing-tiny: -0.18px;
        --ui-letter-spacing-micro: -0.16px;
        --ui-letter-spacing-mini: -0.14px;

        --ui-spacing-0: 0px;
        --ui-spacing-4xs: 2px;
        --ui-spacing-3xs: 4px;
        --ui-spacing-xxs: 6px;
        --ui-spacing-2xs: 7px;
        --ui-spacing-xs: 8px;
        --ui-spacing-1xs: 10px;
        --ui-spacing-s: 12px;
        --ui-spacing-m: 14px;
        --ui-spacing-l: 16px;
        --ui-spacing-2l: 18px;
        --ui-spacing-xl: 20px;
        --ui-spacing-xxl: 24px;
        --ui-spacing-2xl: 32px;
        --ui-spacing-3xl: 40px;
        --ui-spacing-4xl: 90px;
        --ui-spacing-5xl: 95px;

        --ui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --ui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --ui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --ui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --ui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --ui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --ui-duration-lg: 200ms;
        --ui-duration-md: 125ms;
        --ui-duration-sm: 75ms;

        --ui-box-size-xs: 28px;
        --ui-box-size-sm: 30px;
        --ui-box-size-md: 32px;

        --ui-icon-size-inherit: inherit;
        --ui-icon-size-xs: 14px;
        --ui-icon-size-sm: 16px;
        --ui-icon-size-md: 18px;
        --ui-icon-size-lg: 20px;
        --ui-icon-size-xl: 24px;
        --ui-icon-size-xxl: 28px;
        --ui-icon-size-2xl: 36px;
        --ui-icon-size-3xl: 62px;

        --ui-wallet-image-size-inherit: inherit;
        --ui-wallet-image-size-xs: 24px;
        --ui-wallet-image-size-sm: 28px;
        --ui-wallet-image-size-md: 32px;
        --ui-wallet-image-size-mdl: 36px;
        --ui-wallet-image-size-lg: 56px;
        --ui-wallet-image-size-xl: 62px;
        --ui-wallet-image-size-xxl: 80px;

        --ui-color-inherit: inherit;
      }
    `,
    light: css`
      :root {
        --dui-primary: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'light')['--dui-primary']
        )};
        --dui-soft: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'light')['--dui-soft'])};
        --dui-background: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'light')['--dui-background']
        )};
        --dui-foreground: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'light')['--dui-foreground']
        )};
        --dui-black: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'light')['--dui-black'])};
        --dui-white: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'light')['--dui-white'])};

        --ui-color-modal-bg: var(--dui-background);
        --ui-color-text: var(--dui-foreground);

        --ui-color-primary: var(--dui-primary);
        --ui-color-soft: var(--dui-soft);

        --ui-color-background: var(--dui-background);
        --ui-color-foreground: var(--dui-foreground);

        --ui-color-black: var(--dui-black);
        --ui-color-white: var(--dui-white);

        --ui-cover: rgba(157, 161, 161, 0.8);

        --ui-color-surface-ulo: ${unsafeCSS(diditColorScheme.light.surfaceULo)};
        --ui-color-surface-lo: ${unsafeCSS(diditColorScheme.light.surfaceLo)};
        --ui-color-surface-mdlo: ${unsafeCSS(diditColorScheme.light.sufaceMdLo)};
        --ui-color-surface-md: ${unsafeCSS(diditColorScheme.light.sufaceMd)};
        --ui-color-surface-hi: ${unsafeCSS(diditColorScheme.light.sufaceHi)};

        --ui-color-success: ${unsafeCSS(diditColorScheme.light.systemSuccess)};
        --ui-color-error: ${unsafeCSS(diditColorScheme.light.systemError)};
      }
    `,
    dark: css`
      :root {
        --dui-primary: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'dark')['--dui-primary']
        )};
        --dui-soft: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'dark')['--dui-soft'])};
        --dui-background: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'dark')['--dui-background']
        )};
        --dui-foreground: ${unsafeCSS(
          getDiditThemeVariables(themeVariables, 'dark')['--dui-foreground']
        )};
        --dui-black: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'dark')['--dui-black'])};
        --dui-white: ${unsafeCSS(getDiditThemeVariables(themeVariables, 'dark')['--dui-white'])};

        --ui-color-modal-bg: var(--dui-background);
        --ui-color-text: var(--dui-foreground);

        --ui-color-primary: var(--dui-primary);
        --ui-color-soft: var(--dui-soft);

        --ui-color-background: var(--dui-background);
        --ui-color-foreground: var(--dui-foreground);

        --ui-color-black: var(--dui-black);
        --ui-color-white: var(--dui-white);

        --ui-cover: rgba(157, 161, 161, 0.8);

        --ui-color-surface-ulo: ${unsafeCSS(diditColorScheme.dark.surfaceULo)};
        --ui-color-surface-lo: ${unsafeCSS(diditColorScheme.dark.surfaceLo)};
        --ui-color-surface-mdlo: ${unsafeCSS(diditColorScheme.dark.sufaceMdLo)};
        --ui-color-surface-md: ${unsafeCSS(diditColorScheme.dark.sufaceMd)};
        --ui-color-surface-hi: ${unsafeCSS(diditColorScheme.dark.sufaceHi)};

        --ui-color-success: ${unsafeCSS(diditColorScheme.dark.systemSuccess)};
        --ui-color-error: ${unsafeCSS(diditColorScheme.dark.systemError)};
      }
    `
  }
}

// -- Presets -----------------------------------------------------------------
export const resetStyles = css`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--ui-font-family);
    backface-visibility: hidden;
  }
`

export const elementStyles = css`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      background-color var(--ui-ease-inout-power-1) var(--ui-duration-md),
      color var(--ui-ease-inout-power-1) var(--ui-duration-md),
      box-shadow var(--ui-ease-inout-power-1) var(--ui-duration-md);
    will-change: background-color, color;
    outline: none;
    border: none;
    column-gap: var(--ui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  button:disabled > ui-wallet-image,
  button:disabled > ui-image,
  button:disabled > ui-icon,
  button:disabled > ui-link {
    filter: grayscale(1);
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`

export const colorStyles = css`
  .ui-color-inherit {
    color: var(--ui-color-inherit);
  }

  .ui-color-primary {
    color: var(--ui-color-primary);
  }

  .ui-color-soft {
    color: var(--ui-color-soft);
  }

  .ui-color-accent {
    color: var(--ui-color-accent);
  }

  .ui-color-surace-ulo {
    color: var(--ui-color-surface-ulo);
  }

  .ui-color-surace-lo {
    color: var(--ui-color-surface-lo);
  }

  .ui-color-surace-mdlo {
    color: var(--ui-color-surface-mdlo);
  }

  .ui-color-surace-md {
    color: var(--ui-color-surface-md);
  }

  .ui-color-surace-hi {
    color: var(--ui-color-surface-hi);
  }

  .ui-color-error {
    color: var(--ui-color-error);
  }

  .ui-color-success {
    color: var(--ui-color-success);
  }

  .ui-bg-color-inherit {
    background-color: var(--ui-color-inherit);
  }

  .ui-bg-color-primary {
    background-color: var(--ui-color-primary);
  }

  .ui-bg-color-soft {
    background-color: var(--ui-color-soft);
  }

  .ui-bg-color-accent {
    background-color: var(--ui-color-accent);
  }

  .ui-bg-color-surace-ulo {
    background-color: var(--ui-color-surface-ulo);
  }

  .ui-bg-color-surace-lo {
    background-color: var(--ui-color-surface-lo);
  }

  .ui-bg-color-surace-mdlo {
    background-color: var(--ui-color-surface-mdlo);
  }

  .ui-bg-color-surace-md {
    background-color: var(--ui-color-surface-md);
  }

  .ui-bg-color-surace-hi {
    background-color: var(--ui-color-surface-hi);
  }

  .ui-bg-color-error {
    background-color: var(--ui-color-error);
  }

  .ui-bg-color-success {
    background-color: var(--ui-color-success);
  }
`
