/*
 * TODO: add polyfills
 * import '@web3modal/polyfills'
 */

import { http } from 'viem'
import type { CreateConfigParameters, CreateConnectorFn, Config } from 'wagmi'
import { createConfig } from 'wagmi'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type ConfigReactOptions = Partial<CreateConfigParameters> & {
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

export function defaultWagmiReactConfig({
  projectId,
  chains,
  metadata,
  ...wagmiConfig
}: ConfigReactOptions): Config {
  const transportsArr = chains.map(chain => [chain.id, http()])
  const transports = Object.fromEntries(transportsArr)
  const connectors: CreateConnectorFn[] = [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      version: '4',
      appName: metadata?.name ?? 'Unknown',
      appLogoUrl: metadata?.icons[0] ?? 'Unknown',
      /**
       * Determines which wallet options to display in Coinbase Wallet SDK.
       * @property preference
       *   - `all`: Show both smart wallet and EOA options.
       *   - `smartWalletOnly`: Show only smart wallet options.
       *   - `eoaOnly`: Show only EOA options.
       * @see https://www.smartwallet.dev/sdk/v3-to-v4-changes#parameters
       */
      preference: wagmiConfig.coinbasePreference || 'all'
    })
  ]

  return createConfig({
    chains,
    multiInjectedProviderDiscovery: wagmiConfig.multiInjectedProviderDiscovery ?? true,
    transports,
    connectors,
    ...wagmiConfig
  })
}
