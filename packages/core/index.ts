export * from './src/components/index.js'
export * from './src/modal/index.js'
export * from './src/views/index.js'
export type {
  DiditSdkOptions,
  CoreConfig,
  ReactConfig,
  DiditSdkState,
  DiditSdkModalState
} from './src/client.js'
export { DiditSdk } from './src/client.js'
export { ConstantsUtil } from './src/utils/index.js'
export type { DiditAuthStatus, DiditAuthMethod, DiditAuthType } from './src/types/didit.js'

export type { ThemeMode, ThemeVariables } from '@didit-sdk/ui'
export { defaultWagmiCoreConfig, defaultWagmiReactConfig } from './src/wagmi/config/index.js'
