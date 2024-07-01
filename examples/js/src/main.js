import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiCoreConfig, DiditSdk } from '@didit-sdk/js'
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
const wagmiConfig = defaultWagmiCoreConfig({
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
    '--modal-border-radius-master': '0px',
  }
})

// 4. Trigger modal programaticaly
const openConnectModalBtn = document.getElementById('open-connect-modal')

openConnectModalBtn.addEventListener('click', () => {
  diditSDk.openModal()
})

const accountDiv = document.getElementById('account-div')
const logoutBtn = document.getElementById('logout')

diditSDk.subscribeAccountState(state => {
  if (!state.isAuthenticated) {
    logoutBtn.style.display = 'none'
  } else {
    logoutBtn.style.display = 'block'
  }
  accountDiv.innerHTML = `
    <div>authenticated: ${state.isAuthenticated}</div>
    <div>connected: ${state.isWalletConnected}</div>
    <div>walletAddress: ${state.walletAddress}</div>
    <div>network: ${state.selectedNetworkId}: ${state.selectedNetworkName}</div>
    <div>accessToken: ${state.accessToken}</div>
    <div>refreshToken: ${state.refreshToken}</div>
  `
})

logoutBtn.addEventListener('click', () => {
  diditSDk.signOut()
})





diditSDk.subscribeTheme(theme => { console.log('themeModeChanged...', theme.themeMode) })

const themeBtn = document.getElementById('theme-btn')

const themeMode = diditSDk.getThemeMode()
themeBtn.innerText = themeMode === 'light' ? 'Light' : 'Dark'

themeBtn.addEventListener('click', () => {
  const themeMode = diditSDk.getThemeMode()
  const newThemeMode = themeMode === 'light' ? 'dark' : 'light'
  console.log('newThemeMode', newThemeMode)
  diditSDk.setThemeMode(newThemeMode)
  themeBtn.innerText = newThemeMode === 'light' ? 'Light' : 'Dark'
})
