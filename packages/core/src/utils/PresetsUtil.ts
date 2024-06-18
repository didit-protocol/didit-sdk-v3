import type { Web3ConnectorType } from '../types'
import { ConstantsUtil } from './ConstantsUtil'

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
    1: '692ed6ba-e569-459a-556a-776476829e00',
    // Arbitrum
    42161: '3bff954d-5cb0-47a0-9a23-d20192e74600',
    // Avalanche
    43114: '30c46e53-e989-45fb-4549-be3bd4eb3b00',
    // Binance Smart Chain
    56: '93564157-2e8e-4ce7-81df-b264dbee9b00',
    // Fantom
    250: '06b26297-fe0c-4733-5d6b-ffa5498aac00',
    // Optimism
    10: 'ab9c186a-c52f-464b-2906-ca59d760a400',
    // Polygon
    137: '41d04d42-da3b-4453-8506-668cc0727900',
    // Gnosis
    100: '02b53f6a-e3d4-479e-1cb4-21178987d100',
    // EVMos
    9001: 'f926ff41-260d-4028-635e-91913fc28e00',
    // ZkSync
    324: 'b310f07f-4ef7-49f3-7073-2a0a39685800',
    // Filecoin
    314: '5a73b3dd-af74-424e-cae0-0de859ee9400',
    // Iotx
    4689: '34e68754-e536-40da-c153-6ef2e7188a00',
    // Metis,
    1088: '3897a66d-40b9-4833-162f-a2c90531c900',
    // Moonbeam
    1284: '161038da-44ae-4ec7-1208-0ea569454b00',
    // Moonriver
    1285: 'f1d73bb6-5450-4e18-38f7-fb6484264a00',
    // Zora
    7777777: '845c60df-d429-4991-e687-91ae45791600',
    // Celo
    42220: 'ab781bbc-ccc6-418d-d32d-789b15da1f00',
    // Base
    8453: '7289c336-3981-4081-c5f4-efc26ac64a00',
    // Aurora
    1313161554: '3ff73439-a619-4894-9262-4470c773a100',
    // Ronin Mainnet
    2020: 'b8101fc0-9c19-4b6f-ec65-f6dfff106e00',
    // Saigon Testnet (a.k.a. Ronin)
    2021: 'b8101fc0-9c19-4b6f-ec65-f6dfff106e00',
    // Solana chains
    '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'a1b58899-f671-4276-6a5e-56ca5bd59700',
    '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z': 'a1b58899-f671-4276-6a5e-56ca5bd59700',
    EtWTRABZaYq6iMfeYKouRu166VU2xqa1: 'a1b58899-f671-4276-6a5e-56ca5bd59700'
  } as Record<string, string>
}
