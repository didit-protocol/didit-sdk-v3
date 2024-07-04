import { useDiditSdk, useDiditSdkTheme } from '@didit-sdk/react'

const darkImage = 'https://img.icons8.com/ios-filled/50/do-not-disturb-2.png'
const lightImage =
  'https://img.icons8.com/external-glyph-silhouettes-icons-papa-vector/78/external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector.png'

export function ThemeButton() {
  const { setThemeMode, themeMode } = useDiditSdkTheme()

  return (
    <button type="button" id="theme-btn">
      <img
        onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        width="50"
        height="50"
        src={themeMode === 'dark' ? lightImage : darkImage}
        alt="theme button"
      />
    </button>
  )
}
