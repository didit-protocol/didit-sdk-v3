// Import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  // DiditConnectButton,
  DiditSdk
} from '@didit-sdk/core'

/*
 * Type ThemeModeOptions = Parameters<DiditModal['setThemeMode']>[0]
 *
 * type ThemeVariablesOptions = Parameters<DiditModal['setThemeVariables']>[0]
 */

/*
 * Declare global {
 *   namespace JSX {
 *     interface IntrinsicElements {
 *       'w3m-connect-button': Pick<W3mConnectButton, 'size' | 'label' | 'loadingLabel'>
 *       'w3m-account-button': Pick<W3mAccountButton, 'disabled' | 'balance'>
 *       'w3m-button': Pick<W3mButton, 'size' | 'label' | 'loadingLabel' | 'disabled' | 'balance'>
 *       'w3m-network-button': Pick<W3mNetworkButton, 'disabled'>
 *       'w3m-onramp-widget': Pick<W3mOnrampWidget, 'disabled'>
 *     }
 *   }
 * }
 */

let diditSDK: DiditSdk | undefined = undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiditSdk(diditsdk: any) {
  if (diditsdk) {
    diditSDK = diditsdk as DiditSdk
  }
}

/*
 * Export function useDiditSdkTheme() {
 *   if (!modal) {
 *     throw new Error('Please call "createDiditSdk" before using "useDiditSdkTheme" hook')
 *   }
 */

/*
 *   Function setThemeMode(themeMode: ThemeModeOptions) {
 *     modal?.setThemeMode(themeMode)
 *   }
 */

/*
 *   Function setThemeVariables(themeVariables: ThemeVariablesOptions) {
 *     modal?.setThemeVariables(themeVariables)
 *   }
 */

/*
 *   Const [themeMode, setInternalThemeMode] = useState(modal.getThemeMode())
 *   const [themeVariables, setInternalThemeVariables] = useState(modal.getThemeVariables())
 */

/*
 *   UseEffect(() => {
 *     const unsubscribe = modal?.subscribeTheme(state => {
 *       setInternalThemeMode(state.themeMode)
 *       setInternalThemeVariables(state.themeVariables)
 *     })
 */

/*
 *     Return () => {
 *       unsubscribe?.()
 *     }
 *   }, [])
 */

/*
 *   Return {
 *     themeMode,
 *     themeVariables,
 *     setThemeMode,
 *     setThemeVariables
 *   }
 * }
 */

export function useDiditSdk() {
  if (!diditSDK) {
    throw new Error('Please call "createDiditSdk" before using "useDiditSdk" hook')
  }

  async function open() {
    await diditSDK?.openModal()
  }

  async function close() {
    await diditSDK?.closeModal()
  }

  return { open, close }
}

/*
 * Export function useWalletInfo() {
 *   if (!diditSDK) {
 *     throw new Error('Please call "createDiditSdk" before using "useDiditSdk" hook')
 *   }
 */

/*
 *   Const walletInfo = useSyncExternalStore(
 *     diditSDK.subscribeWalletInfo,
 *     diditSDK.getWalletInfo,
 *     diditSDK.getWalletInfo
 *   )
 */

/*
 *   Return { walletInfo }
 * }
 */

/*
 * Export function useDiditSdkState() {
 *   if (!modal) {
 *     throw new Error('Please call "createDiditSdk" before using "useDiditSdkState" hook')
 *   }
 */

//   Const [state, setState] = useState(modal.getState())

/*
 *   UseEffect(() => {
 *     const unsubscribe = modal?.subscribeState(newState => {
 *       setState({ ...newState })
 *     })
 */

/*
 *     Return () => {
 *       unsubscribe?.()
 *     }
 *   }, [])
 */

/*
 *   Return state
 * }
 */
