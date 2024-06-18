import type { SocialConnector } from './socials'
import type { Web3Connector } from './web3'

export type DiditSdkVersion = `didit-sdk-${'js' | 'react' | 'vue'}-${string}`

export type DiditAuthMethod = 'email' | 'wallet_address'

export type DiditAuthType = 'wallet' | 'apple' | 'google'

export type Connector = Web3Connector | SocialConnector

export interface DiditUser {
  id: string
  indentifier: string
  name: string
  image: string
}

export interface DiditSession {
  uuid: string
  identifier: string
  identifierType: DiditAuthMethod
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
