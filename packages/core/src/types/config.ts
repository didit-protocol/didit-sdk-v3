export type Platform = 'mobile' | 'desktop' | 'browser' | 'web' | 'qrcode' | 'unsupported'

export type RouterView =
  | 'Connect'
  | 'Wallets'
  | 'ConnectWallet'
  | 'ConnectWalletConnect'
  | 'ConnectSocial'
  | 'Profile'
  | 'Help'
  | 'Networks'
  | 'ConnectingDiditSiwe'

export type Metadata = {
  name: string
  description: string
  url: string
  icons: string[]
}

type EventKind =
  | 'MODAL_CREATED'
  | 'MODAL_LOADED'
  | 'MODAL_OPEN'
  | 'MODAL_CLOSE'
  | 'SELECT_WALLET'
  | 'CONNECT_SUCCESS'
  | 'CONNECT_ERROR'
  | 'DISCONNECT_SUCCESS'
  | 'DISCONNECT_ERROR'
  | 'CLICK_SIGN_SIWE_MESSAGE'
  | 'CLICK_CANCEL_SIWE'
  | 'CLICK_NETWORKS'
  | 'SIWE_AUTH_SUCCESS'
  | 'SIWE_AUTH_ERROR'
  | 'EMAIL_LOGIN_SELECTED'
  | 'EMAIL_SUBMITTED'
  | 'SWITCH_NETWORK'
  | 'CLICK_PROFILE_LINK'

export interface Event {
  type: 'track'
  event: EventKind
  properties?: {
    authenticated?: boolean
    name?: string
    platform?: Platform
    method?: 'qrcode' | 'mobile' | 'browser' | 'email'
    message?: string
    address?: string
    clientId?: string
    cursor?: string | undefined
    network?: string
  }
}

export interface BaseError {
  message?: string
}
