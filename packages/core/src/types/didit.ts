import type { SocialConnector } from './socials.js'
import type { Web3Connector } from './web3.js'

export type DiditSdkVersion = `didit-sdk-${'js' | 'react' | 'vue'}-${string}`

export type DiditAuthMethod = 'email' | 'wallet_address'

export type DiditAuthType = 'wallet' | 'apple' | 'google'

export type DiditAuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type Connector = Web3Connector | SocialConnector

export interface DiditUser {
  id: string
  indentifier: string
  name: string
  image: string
}

export interface DiditSession {
  id: string
  identifier: string
  identifierType: DiditAuthMethod
  claims: string[]
  exp: number
}

export interface DiditWalletAuthorization {
  code: string
  policy: string
}

export interface DiditTokenAuthorization {
  access_token: string
  claims: string
  expires_in: number
  id_token: string
  refresh_token: string
}

export interface DiditTokenInfo {
  iss: string
  iat: number
  sub: string
  identifier: string
  identifier_type: DiditAuthMethod
  claims: string[]
  exp: number
  client_id: string
  active: boolean
  // ...
}
