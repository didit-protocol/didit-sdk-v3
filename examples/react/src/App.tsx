import { createDiditSdk, defaultWagmiConfig, useDiditSdk } from '@didit-sdk/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useState, useEffect } from 'react'

// 0. Setup queryClient for WAGMIv2
const queryClient = new QueryClient()

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = 'b0337f8e2c56c722a1fb3a4cdf893249'
const clientId = '1liQDdfL2aKpZlSHQTjeNQ'
const clientSecret = '-3GLo9bqc7Y3EXLF57Adna0J_mobab2g1vyzYnnENsQ'

// 2. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  projectId,
  metadata: {
    name: 'DiditSdk React Example',
    description: 'DiditSdk React Example',
    url: '',
    icons: []
  }
})

// 3. Create modal
createDiditSdk({
  wagmiConfig,
  projectId,
  clientId,
  clientSecret
  // themeMode: 'light',
  // themeVariables: {
  // '--w3m-color-mix': '#00DCFF',
  // '--w3m-color-mix-strength': 20
  // }
})

export default function App() {
  const [account, setAccount] = useState()
  // 4. Use modal hook
  const modal = useDiditSdk()

  const handleGetAccount = () => {
    const accunt = modal?.getAccountState()
    console.log('account', accunt)
    setAccount(accunt)
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <button onClick={() => modal.open()}>Connect Wallet</button>
        <button onClick={() => modal.open({ view: 'Networks' })}>Choose Network</button>
        <button onClick={handleGetAccount}>Get Account</button>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
