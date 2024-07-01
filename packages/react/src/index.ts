import { getDiditSdk } from './hooks.js'
import type { DiditClientOptions, ReactConfig } from '@didit-sdk/core'
import { DiditSdk, ConstantsUtil, defaultWagmiReactConfig } from '@didit-sdk/core'

// -- Types -------------------------------------------------------------------
export type { DiditSdk } from '@didit-sdk/core'
export type DiditSdkOptions = Omit<DiditClientOptions<ReactConfig>, '_sdkVersion'>

// -- Setup -------------------------------------------------------------------
let modal: DiditSdk | undefined = undefined

export function createDiditSdk(options: DiditSdkOptions) {
  if (!modal) {
    modal = new DiditSdk({
      ...options,
      _sdkVersion: `didit-sdk-react-${ConstantsUtil.DIDIT_SKD_VERSION}`
    })
    getDiditSdk(modal)
  }

  return modal
}

// -- functions ---------------------------------------------------------------

export const defaultWagmiConfig = defaultWagmiReactConfig

// -- Hooks -------------------------------------------------------------------
export { useDiditSdk } from './hooks.js'
