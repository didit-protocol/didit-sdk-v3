import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiConfig } from '@didit-sdk/js'
import { reconnect } from '@wagmi/core'

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = 'b0337f8e2c56c722a1fb3a4cdf893249'
const clientId = '1liQDdfL2aKpZlSHQTjeNQ'
const clientSecret = '-3GLo9bqc7Y3EXLF57Adna0J_mobab2g1vyzYnnENsQ'

// 2. Create wagmiConfig
const metadata = {
  name: 'Js Example',
  description: 'Js Example',
  url: 'https://didit.me',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
// 2. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata
})

reconnect(wagmiConfig)

// 3. Create modal
const diditSDk = createDiditSdk({
  wagmiConfig,
  projectId,
  clientId,
  clientSecret,
  themeMode: 'dark',
  themeVariables: {
    // '--modal-border-radius-master': '0px'
  }
})

diditSDk.subscribeTheme(theme => {
  changeThemeBtnSvg(theme.themeMode)
})

const themeBtn = document.getElementById('theme-btn')

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

function changeThemeBtnSvg(mode) {
  if (mode === 'light') {
    themeBtn.innerHTML =
      '<img width="50" height="50" src="https://img.icons8.com/ios-filled/50/do-not-disturb-2.png" alt="do-not-disturb-2" />'
  } else {
    themeBtn.innerHTML =
      '<img width="78" height="78" src="https://img.icons8.com/external-glyph-silhouettes-icons-papa-vector/78/external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector.png" alt="external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector" />'
  }
}
