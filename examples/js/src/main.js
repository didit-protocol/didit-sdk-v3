import './pollyfills'
import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiCoreConfig } from '@didit-sdk/core'
import { reconnect } from '@wagmi/core';

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = 'b0337f8e2c56c722a1fb3a4cdf893249'
const clientId = '1liQDdfL2aKpZlSHQTjeNQ'
const clientSecret = "-3GLo9bqc7Y3EXLF57Adna0J_mobab2g1vyzYnnENsQ"

// 2. Create wagmiConfig
const metadata = {
  name: 'Js Example',
  description: 'Js Example',
  url: 'https://didit.me',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};


const chains = [mainnet, arbitrum]
// 2. Create wagmiConfig
const wagmiConfig = defaultWagmiCoreConfig({
  chains,
  projectId,
  metadata,
})

reconnect(wagmiConfig)

// 3. Create modal
const diditSDk = createDiditSdk({
  wagmiConfig,
  projectId,
  clientId,
  clientSecret,
})

// 4. Trigger modal programaticaly
const openConnectModalBtn = document.getElementById('open-connect-modal')

openConnectModalBtn.addEventListener('click', () => {
  diditSDk.openModal()
})

const accountDiv = document.getElementById('account-div')
const logoutBtn = document.getElementById('logout')

diditSDk.subscribeAccountState((state) => {
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


// 5. Alternatively use w3m component buttons (see index.html)
