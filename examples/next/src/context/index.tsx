'use client'

import React, { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createDiditSdk } from '@didit-sdk/react'
import { type State, WagmiProvider } from 'wagmi'
import { clientId, clientSecret, metadata, wagmiConfig } from '@/config'

if (!clientId) {
  throw new Error('Didit Client Id is not defined')
}

const queryClient = new QueryClient()

// Create sdk instance
createDiditSdk({
  wagmiConfig,
  metadata,
  clientId,
  clientSecret,
  redirectUri: 'http://localhost:3002/callback',
  isStaging: true
})

export default function DiditSdkProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
