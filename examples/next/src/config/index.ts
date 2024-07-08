import { arbitrum, mainnet } from 'wagmi/chains'
import { defaultWagmiConfig } from '@didit-sdk/react'
import { cookieStorage, createStorage } from 'wagmi'

// Get cleintId from https://business.didit.me
export const clientId = process.env['NEXT_PUBLIC_DIDI_CLIENT_ID']
export const clientSecret = process.env['NEXT_PUBLIC_DIDI_CLIENT_SECRET']

// 2. Create wagmiConfig
export const metadata = {
  name: 'My App',
  description: 'My app description',
  url: 'https://myapp.com',
  icons: ['https://myapp.com/favicon.ico']
}

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})
