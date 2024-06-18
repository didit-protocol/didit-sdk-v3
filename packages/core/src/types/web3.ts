/* eslint-disable prettier/prettier */
export type ProjectId = string

export type Web3ConnectorType = 'EXTERNAL' | 'WALLET_CONNECT' | 'INJECTED' | 'ANNOUNCED'

export type Web3Connector = {
  id: string
  type: Web3ConnectorType
  name?: string
  imageId?: string
  explorerId?: string
  imageUrl?: string
  info?: {
    uuid?: string
    name?: string
    icon?: string
    rdns?: string
  }
  provider?: unknown
}

export interface Web3Network {
  number: number
  id: string
  name?: string
  imageId?: string
  imageUrl?: string
}

export interface WcWallet {
  id: string
  name: string
  homepage?: string
  image_id?: string
  image_url?: string
  order?: number
  mobile_link?: string | null
  universal_link?: string | null
  desktop_link?: string | null
  webapp_link?: string | null
  app_store?: string | null
  play_store?: string | null
  chrome_store?: string | null
  firefox_store?: string | null
  rdns?: string | null
  injected?:
    | {
        namespace?: string
        injected_id?: string
      }[]
    | null
}

export interface LinkingRecord {
  redirect: string
  href: string
}

interface CacaoHeader {
  t: 'caip122'
}

interface CacaoPayload {
  domain: string
  aud: string
  nonce: string
  iss: string
  version?: string
  iat?: string
  nbf?: string
  exp?: string
  statement?: string
  requestId?: string
  resources?: string[]
  type?: string
}

interface Cacao {
  h: CacaoHeader
  p: CacaoPayload
  s: {
    t: 'eip191' | 'eip1271'
    s: string
    m?: string
  }
}

export interface SIWECreateMessageArgs {
  chainId: number
  domain: string
  nonce: string
  uri: string
  address: string
  version: '1'
  type?: CacaoHeader['t']
  nbf?: string
  exp?: string
  statement?: string
  requestId?: string
  resources?: string[]
  expiry?: number
  iat?: string
}

/*
 * Export type SIWEMessageArgs = {
 *   chains: number[]
 *   methods?: string[]
 * } & Omit<SIWECreateMessageArgs, 'address' | 'chainId' | 'nonce' | 'version'>
 */

export interface SIWEVerifyMessageArgs {
  message: string
  signature: string
  code: string
  cacao?: Cacao
}
