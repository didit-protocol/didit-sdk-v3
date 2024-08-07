import { getDiditSdk } from '../src/hooks.js'
import type { DiditSdkOptions as DiditClientOptions, ReactConfig } from '@didit-sdk/core'
import { DiditSdk, ConstantsUtil } from '@didit-sdk/core'
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

// -- Hooks -------------------------------------------------------------------
export { useDiditSdk, useDiditSdkTheme, useDiditState, useDiditSignOut } from '../src/hooks.js'
