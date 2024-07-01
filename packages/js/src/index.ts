export * from '@didit-sdk/core'

import type { DiditClientOptions, CoreConfig } from '@didit-sdk/core'
import { DiditSdk, ConstantsUtil } from '@didit-sdk/core'

export type DiditSdkOptions = Omit<DiditClientOptions<CoreConfig>, '_sdkVersion'>

export function createDiditSdk(options: DiditSdkOptions) {
  return new DiditSdk({
    ...options,
    _sdkVersion: `didit-sdk-js-${ConstantsUtil.DIDIT_SKD_VERSION}`
  })
}
