import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { defaultWagmiConfig } from '@didit-sdk/react/config'
import { createDiditSdk } from '@didit-sdk/react'

const clientId = process.env['NEXT_PUBLIC_DIDIT_CLIENT_ID'] || ''

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
  metadata,
  clientId,
  walletAuthBaseUrl: 'http://localhost:3003/',
  redirectUri: 'http://localhost:3003/callback',
  walletAuthorizationPath: '/api/wallet-auth',
  tokenAuthorizationPath: '/api/token',
  scope: 'openid',
  claims: 'read:blockchain read:gender read:email read:phone read:picture',
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
