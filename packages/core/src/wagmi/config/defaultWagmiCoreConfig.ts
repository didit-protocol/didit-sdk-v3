/*
 * TODO: Add polyfills
 * import '@didit-sdk/polyfills'
 */

import type { CreateConfigParameters } from '@wagmi/core'
import { http } from 'viem'
import { createConfig } from '@wagmi/core'
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type ConfigCoreOptions = Partial<CreateConfigParameters> & {
  chains: CreateConfigParameters['chains']
  projectId: string
  metadata: {
    name: string
    description: string
    url: string
    icons: string[]
  }
  coinbasePreference?: 'all' | 'smartWalletOnly' | 'eoaOnly'
}

export function defaultWagmiCoreConfig({
  projectId,
  chains,
  metadata,
  ...wagmiConfig
}: ConfigCoreOptions) {
  // Create view default transports for each chain
  const transportsArr = chains.map(chain => [chain.id, http(chain.rpcUrls[0]?.http?.[0])])
  const transports = Object.fromEntries(transportsArr)
  const connectors = [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      // Version: '4',
      appName: metadata?.name ?? 'Unknown',
      appLogoUrl: metadata?.icons[0] ?? 'Unknown',
      preference: wagmiConfig.coinbasePreference || 'all'
    })
  ]

  return createConfig({
    chains,
    multiInjectedProviderDiscovery: true,
    transports,
    connectors,
    ...wagmiConfig
  })
}
