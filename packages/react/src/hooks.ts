// Import { useEffect, useState, useSyncExternalStore } from 'react'
import { DiditButton, DiditSdk } from '@didit-sdk/core'
import type { ThemeMode, ThemeVariables, DiditSdkState, DiditSdkModalState } from '@didit-sdk/core'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'didit-button': Pick<DiditButton, 'disabled' | 'label' | 'loadingLabel'>
      'didit-callback': Pick<DiditButton, 'disabled'>
      'didit-socials-view': Partial<{
        socialButtonPrefix: string
        className: string
        style: CSSProperties
        id: string
      }>
    }
  }
}

let diditSDK: DiditSdk | undefined = undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiditSdk(diditsdk: any) {
  if (diditsdk) {
    diditSDK = diditsdk as DiditSdk
  }
}

export function useDiditSdkTheme() {
  if (!diditSDK) {
    throw new Error('Please call "createDiditSdk" before using "useDiditSdkTheme" hook')
  }

  function setThemeMode(themeMode: ThemeMode) {
    diditSDK?.setThemeMode(themeMode)
  }

  function setThemeVariables(themeVariables: ThemeVariables) {
    diditSDK?.setThemeVariables(themeVariables)
  }

  const [themeMode, setInternalThemeMode] = useState(diditSDK?.getThemeMode())
  const [themeVariables, setInternalThemeVariables] = useState(diditSDK?.getThemeVariables())

  useEffect(() => {
    const unsubscribe = diditSDK?.subscribeTheme(state => {
      setInternalThemeMode(state.themeMode)
      setInternalThemeVariables(state.themeVariables)
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return {
    themeMode,
    themeVariables,
    setThemeMode,
    setThemeVariables
  }
}

export function useDiditSdk() {
  const [state, setState] = useState<DiditSdkModalState>()

  if (!diditSDK) {
    throw new Error('Please call "createDiditSdk" before using "useDiditSdk" hook')
  }

  const openModal = useCallback(async () => {
    await diditSDK?.openModal()
  }, [])

  const closeModal = useCallback(async () => {
    await diditSDK?.closeModal()
  }, [])

  useEffect(() => {
    const unsubscribe = diditSDK?.subscribeDiditModalState(newState => {
      setState(newState)
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return {
    isOpen: state?.isOpen,
    isLoding: state?.isLoading,
    openModal,
    closeModal
  }
}

export function useDiditSignOut() {
  const signOut = useCallback(async () => {
    await diditSDK?.signOut()
  }, [])

  return signOut
}

export function useDiditState(): DiditSdkState {
  if (!diditSDK) {
    throw new Error('Please call "createDiditSdk" before using "useDiditState" hook')
  }

  const [state, setState] = useState(diditSDK.getDiditState())

  useEffect(() => {
    const unsubscribe = diditSDK?.subscribeDiditState(newState => {
      setState({ ...newState })
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return state
}
