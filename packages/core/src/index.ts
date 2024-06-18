export * from './components'
export * from './modal'
export * from './views'
/*
 * TODOX: move this to js package and export onlu the needed functionalities
 * @didit-sdk/js
 */
import type { DiditClientOptions, CoreConfig } from './client'
import { DiditSdk } from './client'
import { ConstantsUtil } from './utils'

export type { DiditSdk, DiditClientOptions } from './client'
export { defaultWagmiCoreConfig } from './wagmi/config'

export function createDiditSdk(options: DiditClientOptions<CoreConfig>) {
  return new DiditSdk({
    ...options,
    _sdkVersion: `didit-sdk-js-${ConstantsUtil.DIDIT_SKD_VERSION}`
  })
}
