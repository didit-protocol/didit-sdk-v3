import type { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ConstantsUtil, CoreHelperUtil, StorageUtil } from '../../utils'
import { connect, disconnect, getChainId, reconnect, signMessage, switchChain } from '@wagmi/core'
import type { CoreConfig } from '../../client'
import {
  AccountController,
  DiditAuthController,
  type ConnectionControllerClient,
  type DiditAuthControllerClient
} from '../../controllers'
import type { DiditSession, SIWECreateMessageArgs, SIWEVerifyMessageArgs } from '../../types'
import { DiditApiController } from '../../controllers/DiditApi'

export function createConnectionControllerClient(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  wagmiConfig: CoreConfig
): ConnectionControllerClient {
  return {
    connectWalletConnect: async onUri => {
      const connector = wagmiConfig.connectors.find(
        c => c.id === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID
      )
      if (!connector) {
        throw new Error('connectionControllerClient:getWalletConnectUri - connector is undefined')
      }
      const provider = (await connector.getProvider()) as Awaited<
        ReturnType<(typeof EthereumProvider)['init']>
      >

      provider.on('display_uri', data => {
        onUri(data)
      })

      const chainId = getChainId(wagmiConfig)
      // Make sure client uses ethereum provider version that supports `authenticate`
      await connect(wagmiConfig, { connector, chainId })
    },

    connectExternal: async ({ id, provider, info }) => {
      const connector = wagmiConfig.connectors.find(c => c.id === id)
      if (!connector) {
        throw new Error('connectionControllerClient:connectExternal - connector is undefined')
      }
      if (provider && info && connector.id === ConstantsUtil.EIP6963_CONNECTOR_ID) {
        // @ts-expect-error Exists on EIP6963Connector
        connector.setEip6963Wallet?.({ provider, info })
      }
      const chainId = getChainId(wagmiConfig)

      await connect(wagmiConfig, { connector, chainId })
    },

    reconnectExternal: async ({ id }) => {
      const connector = wagmiConfig.connectors.find(c => c.id === id)

      if (!connector) {
        throw new Error('connectionControllerClient:connectExternal - connector is undefined')
      }

      await reconnect(wagmiConfig, { connectors: [connector] })
    },

    checkInstalled: ids => {
      // Get connectors from connectors controller
      const injectedConnector = wagmiConfig.connectors.find(c => c.type === 'INJECTED')

      if (!ids) {
        return Boolean(window.ethereum)
      }

      if (injectedConnector) {
        if (!window?.ethereum) {
          return false
        }

        return ids.some(id => Boolean(window.ethereum?.[String(id)]))
      }

      return false
    },

    disconnect: async () => {
      await disconnect(wagmiConfig)
    },

    signMessage: async message => signMessage(wagmiConfig, { message }),
    switchNetwork: async chainId => {
      if (chainId) {
        await switchChain(wagmiConfig, { chainId })
      }
    },
    connectSocialProvider: provider => {
      const codeVerifier = CoreHelperUtil.generateCodeVerifier()
      const codeChallenge = CoreHelperUtil.generateCodeChallenge(codeVerifier)
      const authorizationUrl = DiditApiController.genetateProviderAuthUrl(
        provider,
        codeVerifier,
        codeChallenge
      )
      // Open a pop-up centered in the middle of the screen instead of redirecting
      const width = ConstantsUtil.DIDIT_EMAIL_POPUP_WIDTH
      const height = ConstantsUtil.DIDIT_EMAIL_POPUP_HEIGHT

      // Position the popup window in top left corner
      const left = window.screenX + window.innerWidth
      const top = window.screenY
      const popupReference = CoreHelperUtil.returnOpenHref(
        '',
        'popupWindow',
        `width=${width},height=${height},left=${left},top=${top}`
      )
      if (popupReference) {
        popupReference.location = authorizationUrl
      }

      return {
        codeVerifier,
        popupWindow: popupReference
      }
    }
  }
}

// Get only 3 properties from type DiditAuthControllerClient

type DiditAuthControllerOptions = Pick<
  DiditAuthControllerClient,
  'onSignIn' | 'onSignOut' | 'onError'
>

export function createDiditAuthControllerMethods(options: DiditAuthControllerOptions) {
  return {
    async getNonce(address?: string) {
      if (!address) {
        throw new Error('DiditAuthControllerClient:getNonce - address is undefined')
      }
      const data = await DiditApiController.walletAuthorization(address)
      if (!data) {
        throw new Error('DiditAuthControllerClient:getNonce - data is undefined')
      }
      const { code, policy } = data

      return { code, policy }
    },
    createMessage({ nonce }: SIWECreateMessageArgs) {
      const policy = nonce

      return policy
    },
    async verifyMessage({ signature, code }: SIWEVerifyMessageArgs) {
      const tokens = await DiditApiController.tokenAuthorization(code, signature)
      // Store tokens in local storage
      if (!tokens) {
        throw new Error('DiditAuthControllerClient:verifyMessage - tokens are undefined')
      }

      return tokens
    },
    async getSession(accessToken?: string, refreshToken?: string): Promise<DiditSession | null> {
      // Call next inrospect endpoint
      if (!accessToken) {
        throw new Error('DiditAuthControllerClient:getSession - accessToken is undefined')
      }
      try {
        const data = await DiditApiController.introspectToken(accessToken)
        if (data?.active) {
          return {
            id: data.sub,
            identifier: data.identifier,
            identifierType: data.identifier_type,
            claims: data.claims,
            exp: data.exp
          }
        }

        return null
      } catch (error) {
        if (refreshToken) {
          // Refresh token before assuming session is invalid
          const tokens = await DiditApiController.refreshTokens(refreshToken)
          if (tokens) {
            StorageUtil.setDiditAuthTokens(tokens)
            const data = await DiditApiController.introspectToken(tokens?.access_token)
            if (data?.active) {
              return {
                id: data.sub,
                identifier: data.identifier,
                identifierType: data.identifier_type,
                claims: data.claims,
                exp: data.exp
              }
            }
          }
        }

        return null
      }
    },

    async signOut() {
      const { accessToken, authMethod } = AccountController.state
      if (authMethod !== 'wallet' && accessToken) {
        await DiditApiController.logoutSocialProvider(accessToken)
      }

      return true
    },

    async verifySocialOAuthCode(code: string) {
      const codeVerifier = DiditAuthController.getCodeVerifier()
      if (!codeVerifier) {
        throw new Error(
          'DiditAuthControllerClient:verifySocialOAuthCode - codeVerifier is undefined'
        )
      }
      const tokens = await DiditApiController.verifySocialOAuthCode(code, codeVerifier)
      if (!tokens) {
        throw new Error('DiditAuthControllerClient:verifySocialOAuthCode - tokens are undefined')
      }

      return tokens
    },

    onSignIn(session: DiditSession) {
      options?.onSignIn?.(session)
    },
    onSignOut() {
      options?.onSignOut?.()
    },
    onError(error: unknown) {
      options?.onError?.(error)
    }
  }
}
