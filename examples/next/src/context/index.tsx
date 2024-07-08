'use client'

import React, { type ReactNode } from 'react'
import { wagmiConfig, clientId, metadata } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createDiditSdk } from '@didit-sdk/react'
import { type State, WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

if (!clientId) {
  throw new Error('Didit Client Id is not defined')
}

// Create sdk instance
createDiditSdk({
  wagmiConfig,
  clientId,
  metadata
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
