import type { DiditClientOptions, CoreConfig } from '@didit-sdk/core'
import { DiditSdk, ConstantsUtil } from '@didit-sdk/core'


export type { DiditSdk, DiditAuthStatus, DiditAuthMethod } from '@didit-sdk/core'
export type DiditSdkOptions = Omit<DiditClientOptions<CoreConfig>, '_sdkVersion'>

export { defaultWagmiCoreConfig as defaultWagmiConfig } from '@didit-sdk/core'

export function createDiditSdk(options: DiditSdkOptions) {
  return new DiditSdk({
    ...options,
    _sdkVersion: `didit-sdk-js-${ConstantsUtil.DIDIT_SKD_VERSION}`
  })
}
