import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiConfig } from '@didit-sdk/js'
import { reconnect } from '@wagmi/core'

const clientId = '1liQDdfL2aKpZlSHQTjeNQ'
const clientSecret = '-3GLo9bqc7Y3EXLF57Adna0J_mobab2g1vyzYnnENsQ'

// 1. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata: {
    name: 'Js Example',
    description: 'Js Example',
    url: 'https://didit.me',
    icons: []
  }
})

reconnect(wagmiConfig)

// 3. Create modal
const diditSDk = createDiditSdk({
  wagmiConfig,
  clientId,
  clientSecret,
  themeMode: 'light',
  themeVariables: {
    primaryColor: '#FF0000'
  },
  isStaging: true
})

diditSDk.subscribeTheme(theme => {
  changeThemeBtnSvg(theme.themeMode)
})

diditSDk.openModal()
diditSDk.subscribeDiditState(({ isAuthenticated, accessToken, user }) => {
  console.log('didit state->', {
    isAuthenticated,
    accessToken,
    user
  })
})

diditSDk.subscribeDiditModalState(({ isLoading, isOpen }) => {
  console.log('modal state->', {
    isLoading,
    isOpen
  })
})

const themeBtn = document.getElementById('theme-btn')!

if (themeBtn) {
  const themeMode = diditSDk.getThemeMode()
  changeThemeBtnSvg(themeMode)
  themeBtn.addEventListener('click', () => {
    const themeMode = diditSDk.getThemeMode()
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light'
    diditSDk.setThemeMode(newThemeMode)
    changeThemeBtnSvg(newThemeMode)
  })
}

function changeThemeBtnSvg(mode: 'light' | 'dark') {
  if (mode === 'light') {
    themeBtn.innerHTML =
      '<img width="50" height="50" src="https://img.icons8.com/ios-filled/50/do-not-disturb-2.png" alt="do-not-disturb-2" />'
  } else {
    themeBtn.innerHTML =
      '<img width="78" height="78" src="https://img.icons8.com/external-glyph-silhouettes-icons-papa-vector/78/external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector.png" alt="external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector" />'
  }
}
