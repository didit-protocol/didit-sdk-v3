import { arbitrum, mainnet } from '@wagmi/core/chains'
import { defaultWagmiConfig, createDiditSdk } from '@didit-sdk/react'
import { reconnect } from '@wagmi/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import './styles.css'
import { ThemeButton } from './ThemeButton'
import { ModalButton } from './ModalButton'
import { UserStatus } from './UserStatus'

// 0. Setup queryClient
const queryClient = new QueryClient()

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

// 2. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  projectId,
  metadata
})

reconnect(wagmiConfig)

// 3. creat options
createDiditSdk({
  wagmiConfig,
  projectId,
  clientId,
  clientSecret,
  redirectUri: 'http://localhost:3002/callback',
  themeMode: 'dark',
  themeVariables: {
    // '--modal-border-radius-master': '0px'
  }
})

export default function App() {
  // 4. Use modal hook

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="row">
          <didit-button />
          <ThemeButton />
        </div>
        <div className="row">
          <ModalButton />
        </div>
        <UserStatus />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
