import type { Web3ConnectorType } from '../types/index.js'
import { ConstantsUtil } from './ConstantsUtil.js'

export const PresetsUtil = {
  ConnectorExplorerIds: {
    [ConstantsUtil.COINBASE_CONNECTOR_ID]:
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    [ConstantsUtil.COINBASE_SDK_CONNECTOR_ID]:
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    [ConstantsUtil.SAFE_CONNECTOR_ID]:
      '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f',
    [ConstantsUtil.LEDGER_CONNECTOR_ID]:
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927'
  } as Record<string, string>,
  ConnectorImageIds: {
    [ConstantsUtil.COINBASE_CONNECTOR_ID]: 'a5ebc364-8f91-4200-fcc6-be81310a0000',
    [ConstantsUtil.COINBASE_SDK_CONNECTOR_ID]: 'a5ebc364-8f91-4200-fcc6-be81310a0000',
    [ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID]: 'cfbb273b-0070-49b2-54dd-b157c820da00',
    [ConstantsUtil.INJECTED_CONNECTOR_ID]: '07ba87ed-43aa-4adf-4540-9e6a2b9cae00'
  } as Record<string, string>,
  ConnectorTypesMap: {
    [ConstantsUtil.INJECTED_CONNECTOR_ID]: 'INJECTED',
    [ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID]: 'WALLET_CONNECT',
    [ConstantsUtil.EIP6963_CONNECTOR_ID]: 'ANNOUNCED'
  } as Record<string, Web3ConnectorType>,
  EIP155NetworkImageIds: {
    // Ethereum
    1: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
    // Arbitrum
    42161: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
    // Avalanche
    43114: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
    // Binance Smart Chain
    56: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
    // Linea
    59144: 'https://icons.llamao.fi/icons/chains/rsz_linea.jpg',
    // Optimism
    10: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
    // Polygon
    137: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
    // Fantom
    250: 'https://icons.llamao.fi/icons/chains/rsz_fantom.jpg',
    // Base
    8453: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
    // Cronos Minnet
    25: 'https://icons.llamao.fi/icons/chains/rsz_cronos.jpg',
    // Mantle
    5000: 'https://icons.llamao.fi/icons/chains/rsz_mantle.jpg',
    // Gnosis
    100: 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg'
  } as Record<string, string>
}
