export * from './components/index.js'
export * from './modal/index.js'
export * from './views/index.js'
export type {
  DiditSdkOptions,
  CoreConfig,
  ReactConfig,
  DiditSdkState,
  DiditSdkModalState
} from './client.js'
export { DiditSdk } from './client.js'
export { ConstantsUtil } from './utils/index.js'
export type { DiditAuthStatus, DiditAuthMethod, DiditAuthType } from './types/didit.js'

export type { ThemeMode, ThemeVariables } from '@didit-sdk/ui'
export { defaultWagmiCoreConfig, defaultWagmiReactConfig } from './wagmi/config/index.js'
