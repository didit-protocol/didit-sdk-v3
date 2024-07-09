import { arbitrum, mainnet } from 'wagmi/chains'
import { createDiditSdk } from '@didit-sdk/react'
import { defaultWagmiConfig } from '@didit-sdk/react/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

const clientId = import.meta.env['VITE_DIDIT_CLIENT_ID']
const clientSecret = import.meta.env['VITE_DIDIT_CLIENT_SECRET']

// 0. Setup queryClient
const queryClient = new QueryClient()

// 2. Create wagmiConfig
const metadata = {
  name: 'React Example',
  description: 'React Example',
  url: 'https://react-example.me',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 2. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata
})

// 3. creat options
createDiditSdk({
  wagmiConfig,
  clientId,
  clientSecret,
  redirectUri: 'http://localhost:3002/callback',
  metadata,
  isStaging: true
})

interface DiditSdkProviderProps {
  children: React.ReactNode
}

export default function DiditSdkProvider({ children }: DiditSdkProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
