// Import type { WcWallet, ConnectorType, SocialProvider } from './TypeUtil.js'

import type {
  DiditAuthType,
  DiditSession,
  DiditTokenAuthorization,
  SocialConnectorType
} from '../types'

// -- Helpers -----------------------------------------------------------------
const DIDIT_SESSION = 'DIDIT_AUTH_SESSION'
const DIDIT_TOKENS = 'DIDIT_AUTH_TOKENS'
const DIDIT_SOCIAL_PROVIDER = 'DIDIT_SOCIAL_PROVIDER'
const DIDIT_SOCIAL_CODE_VERIFIER = 'DIDIT_SOCIAL_CODE_VERIFIER'

// -- Utility -----------------------------------------------------------------
export const StorageUtil = {
  setDiditAuthMethod(type: DiditAuthType) {
    try {
      localStorage.setItem('DIDIT_AUTH_METHOD', type)
    } catch {
      console.info('Unable to set DiditAuth method')
    }
  },

  setDiditAuthSession(session: DiditSession) {
    try {
      localStorage.setItem('DIDIT_AUTH_SESSION', JSON.stringify(session))
    } catch {
      console.info('Unable to set DiditAuth session')
    }
  },

  getDiditAuthSession() {
    try {
      const session = localStorage.getItem(DIDIT_SESSION)
      if (session) {
        return JSON.parse(session) as DiditSession
      }
    } catch {
      console.info('Unable to get DiditAuth session')
    }

    return undefined
  },

  deleteDiditAuthSession() {
    try {
      localStorage.removeItem(DIDIT_SESSION)
    } catch {
      console.info('Unable to delete DiditAuth session')
    }
  },

  setDiditAuthTokens(tokens: DiditTokenAuthorization) {
    try {
      localStorage.setItem(DIDIT_TOKENS, JSON.stringify(tokens))
    } catch {
      console.info('Unable to set DiditAuth tokens')
    }
  },

  getDiditAuthTokens() {
    try {
      const tokens = localStorage.getItem(DIDIT_TOKENS)
      if (tokens) {
        return JSON.parse(tokens) as DiditTokenAuthorization
      }
    } catch {
      console.info('Unable to get DiditAuth tokens')
    }

    return undefined
  },

  deleteDiditAuthTokens() {
    try {
      localStorage.removeItem(DIDIT_TOKENS)
    } catch {
      console.info('Unable to delete DiditAuth tokens')
    }
  },

  setConnectedSocialProvider(provider: SocialConnectorType) {
    try {
      localStorage.setItem(DIDIT_SOCIAL_PROVIDER, provider)
    } catch {
      console.info('Unable to set connected social provider')
    }
  },

  getConnectedSocialProvider() {
    try {
      return localStorage.getItem(DIDIT_SOCIAL_PROVIDER) as SocialConnectorType
    } catch {
      console.info('Unable to get connected social provider')
    }

    return undefined
  },

  deleteConnectedSocialProvider() {
    try {
      localStorage.removeItem(DIDIT_SOCIAL_PROVIDER)
    } catch {
      console.info('Unable to delete connected social provider')
    }
  },

  setSocialCodeVerifier(codeVerifier: string) {
    try {
      localStorage.setItem(DIDIT_SOCIAL_CODE_VERIFIER, codeVerifier)
    } catch {
      console.info('Unable to set social code verifier')
    }
  },

  getSocialCodeVerifier() {
    try {
      return localStorage.getItem(DIDIT_SOCIAL_CODE_VERIFIER)
    } catch {
      console.info('Unable to get social code verifier')
    }

    return undefined
  },

  deleteSocialCodeVerifier() {
    try {
      localStorage.removeItem(DIDIT_SOCIAL_CODE_VERIFIER)
    } catch {
      console.info('Unable to delete social code verifier')
    }
  }
}
