import { watchAccount, watchConnectors, type GetAccountReturnType } from '@wagmi/core'
import type { Chain, Hex } from 'viem'
import {
  setColorTheme,
  setThemeVariables,
  type ThemeMode,
  type ThemeVariables
} from '@didit-sdk/ui'
import type {
  AccountControllerState,
  ConfigurationControllerState,
  ConnectionControllerClient,
  DiditAuthControllerClient,
  ModalControllerState,
  ThemeControllerState
} from './controllers/index.js'
import {
  AccountController,
  ConfigurationController,
  ConnectionController,
  DiditAuthController,
  ModalController,
  ThemeController
} from './controllers/index.js'
import type { DiditAuthMethod, DiditAuthStatus, Web3Connector, Web3Network } from './types/index.js'
import { ConstantsUtil, CoreHelperUtil } from './utils/index.js'
import {
  wcWallets,
  socialConnectors,
  type defaultWagmiCoreConfig,
  type defaultWagmiReactConfig
} from './wagmi/config/index.js'
import { PresetsUtil } from './utils/PresetsUtil.js'
import { ConnectorController } from './controllers/Connectors.js'
import {
  createConnectionControllerClient,
  createDiditAuthControllerMethods
} from './wagmi/clients/index.js'
import { DiditApiController, type DiditApiControllerState } from './controllers/DiditApi.js'

// Import { ConstantsUtil, CoreHelperUtil } from './utils'

// -- Helpers -------------------------------------------------------------------

let isInitialized = false

// -- Types ---------------------------------------------------------------------
export type CoreConfig = ReturnType<typeof defaultWagmiCoreConfig>
export type ReactConfig = ReturnType<typeof defaultWagmiReactConfig>
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type Config = ReactConfig | CoreConfig

interface DiditClientOptions<C extends Config> {
  connectionControllerClient: ConnectionControllerClient
  diditAuthControllerClient: DiditAuthControllerClient
  clientId: ConfigurationControllerState['clientId']
  clientSecret?: ConfigurationControllerState['clientSecret']
  projectId?: ConfigurationControllerState['projectId']
  metadata?: ConfigurationControllerState['metadata']
  walletAuthBaseUrl?: DiditApiControllerState['walletAuthBaseUrl']
  walletAuthorizationPath?: DiditApiControllerState['walletAuthorizationPath']
  tokenAuthorizationPath?: DiditApiControllerState['tokenAuthorizationPath']
  redirectUri?: DiditApiControllerState['redirectUri']
  claims?: ConfigurationControllerState['claims']
  scope?: ConfigurationControllerState['scope']
  isStaging?: DiditApiControllerState['isStaging']
  onSignIn?: DiditAuthControllerClient['onSignIn']
  onSignOut?: DiditAuthControllerClient['onSignOut']
  onError?: DiditAuthControllerClient['onError']
  themeMode?: ThemeMode
  themeVariables?: ThemeVariables
  _sdkVersion: ConfigurationControllerState['sdkVersion']
  wagmiConfig: C
}

export type DiditSdkOptions<C extends Config> = Omit<
  DiditClientOptions<C>,
  'connectionControllerClient' | 'diditAuthControllerClient'
>

export interface DiditUser {
  id: string
  identifier: string
  identifierType: DiditAuthMethod
}

export interface DiditSdkState
  extends Omit<
    AccountControllerState,
    'network' | 'requestedNetworks' | 'diditSession' | 'timeout'
  > {
  user?: DiditUser
  status: DiditAuthStatus
  selectedNetworkId: number | undefined
  selectedNetworkName: string | undefined
}

export interface DiditSdkModalState {
  isOpen: boolean
  isLoading: boolean
}

// -- Client --------------------------------------------------------------------
export class DiditSdk {
  private initPromise?: Promise<void> = undefined

  private hasSyncedConnectedAccount = false

  private wagmiConfig: DiditClientOptions<CoreConfig>['wagmiConfig']

  public constructor(options: DiditSdkOptions<CoreConfig>) {
    const { wagmiConfig, _sdkVersion, scope, claims, ...diditSdkOptions } = options
    if (!wagmiConfig) {
      throw new Error('diditsdk:constructor: wagmiConfig is required')
    }
    if (!diditSdkOptions.clientId) {
      throw new Error('diditsdk:constructor: clientId is required')
    }

    if (scope && !CoreHelperUtil.isValideScopeString(scope)) {
      throw new Error('diditsdk:constructor: Invalid scope string')
    }

    if (claims && !CoreHelperUtil.isValidClaimsString(claims)) {
      throw new Error('diditsdk:constructor: Invalid claims string')
    }

    const connectionControllerClient = createConnectionControllerClient(wagmiConfig)
    const diditAuthClientMethods = createDiditAuthControllerMethods({
      onError: diditSdkOptions.onError,
      onSignIn: diditSdkOptions.onSignIn,
      onSignOut: diditSdkOptions.onSignOut
    })
    const diditAuthClient: DiditAuthControllerClient = {
      ...diditAuthClientMethods,
      async web3SignIn() {
        const { walletAddress, network } = AccountController.state
        if (!walletAddress) {
          throw new Error('DiditAuthControllerClient:web3SignIn - walletInfo is undefined')
        }
        const nonce = await diditAuthClientMethods.getNonce(walletAddress)
        const chainId = network?.number
        if (!chainId) {
          throw new Error('DiditAuthControllerClient:web3SignIn - chainId is undefined')
        }
        // Const messageParams = await diditAuthClientMethods.getMessageParams()

        const message = diditAuthClientMethods.createMessage({
          address: walletAddress,
          chainId,
          nonce: nonce.policy,
          version: '1',
          domain: ConstantsUtil.DIDIT_DOMAIN,
          uri: ConstantsUtil.DIDIT_BASE_AUTH_URL
        })
        const signature = await ConnectionController.signMessage(message)
        const tokens = await diditAuthClientMethods.verifyMessage({
          message,
          signature,
          code: nonce?.code || ''
        })
        if (!tokens) {
          throw new Error('DiditAuthControllerClient:web3SignIn - isValid is false')
        }
        AccountController.setDiditTokens(tokens)
        const session = await diditAuthClientMethods.getSession(tokens.access_token)
        if (!session) {
          throw new Error('DiditAuthControllerClient:web3SignIn - session is undefined')
        }

        AccountController.setDiditSession(session)
        AccountController.setIsAuthenticated(true)
        if (diditAuthClientMethods.onSignIn) {
          diditAuthClientMethods.onSignIn(session)
        }

        ModalController.close()

        return session
      },
      async socialSignIn(code: string) {
        const tokens = await diditAuthClientMethods.verifySocialOAuthCode(code)
        const session = await diditAuthClientMethods.getSession(
          tokens.access_token,
          tokens.refresh_token
        )
        if (!session) {
          throw new Error('DiditAuthControllerClient:web3SignIn - session is undefined')
        }
        AccountController.setDiditTokens(tokens)
        AccountController.setDiditSession(session)
        AccountController.setIsAuthenticated(true)

        return session
      }
    }

    this.initControllers({
      connectionControllerClient,
      diditAuthControllerClient: diditAuthClient,
      ...options,
      _sdkVersion: _sdkVersion ?? `didit-sdk-undefined-${ConstantsUtil.DIDIT_SKD_VERSION}`
    })

    this.initOrContinue()
    this.syncDiditAuth()

    // This.options = options
    this.wagmiConfig = wagmiConfig

    this.syncRequestedNetworks([...wagmiConfig.chains])

    this.syncConnectors([...wagmiConfig.connectors])

    watchConnectors(this.wagmiConfig, {
      onChange: connectors => this.syncConnectors(connectors)
    })

    watchAccount(this.wagmiConfig, {
      onChange: accountData => this.syncAccount(accountData)
    })
  }

  // -- Public -------------------------------------------------------------------

  public getDiditState(): DiditSdkState {
    const accountState = AccountController.state
    const { network } = accountState
    const user = accountState.diditSession
      ? {
          id: accountState.diditSession.id,
          identifier: accountState.diditSession.identifier,
          identifierType: accountState.diditSession.identifierType
        }
      : undefined

    return {
      isAuthenticated: accountState.isAuthenticated,
      user,
      status: CoreHelperUtil.getDiditAuthStatus(accountState.isAuthenticated),
      accessToken: accountState.accessToken,
      refreshToken: accountState.refreshToken,
      authMethod: accountState.authMethod,
      isWalletConnected: accountState.isWalletConnected,
      walletAddress: accountState.walletAddress,
      addressExplorerUrl: accountState.addressExplorerUrl,
      selectedNetworkId: network?.number,
      selectedNetworkName: network?.name
    }
  }

  public subscribeDiditState(callback: (newState: DiditSdkState) => void) {
    return AccountController.subscribe((newState: AccountControllerState) => {
      const { network } = newState
      const user = newState.diditSession
        ? {
            id: newState.diditSession.id,
            identifier: newState.diditSession.identifier,
            identifierType: newState.diditSession.identifierType
          }
        : undefined

      return callback({
        isAuthenticated: newState.isAuthenticated,
        user,
        status: CoreHelperUtil.getDiditAuthStatus(newState.isAuthenticated),
        accessToken: newState.accessToken,
        refreshToken: newState.refreshToken,
        authMethod: newState.authMethod,
        isWalletConnected: newState.isWalletConnected,
        walletAddress: newState.walletAddress,
        addressExplorerUrl: newState.addressExplorerUrl,
        selectedNetworkId: network?.number,
        selectedNetworkName: network?.name
      })
    })
  }

  public subscribeDiditModalState(callback: (newState: DiditSdkModalState) => void) {
    return ModalController.subscribe((newState: ModalControllerState) =>
      callback({
        isOpen: newState.open,
        isLoading: newState.loading
      })
    )
  }

  public getDiditModalState(): DiditSdkModalState {
    return {
      isOpen: ModalController.state.open,
      isLoading: ModalController.state.loading
    }
  }

  public async openModal() {
    await this.initOrContinue()
    ModalController.open()
  }

  public async closeModal() {
    await this.initOrContinue()
    ModalController.close()
  }

  public async signOut() {
    if (AccountController.state.isAuthenticated) {
      await DiditAuthController.signOut()
    }
    if (AccountController.state.isWalletConnected) {
      ConnectionController.disconnect()
    }
    ModalController.close()
  }

  public getThemeMode() {
    return ThemeController.state.themeMode
  }

  public getThemeVariables() {
    return ThemeController.state.themeVariables
  }

  public setThemeMode(themeMode: ThemeControllerState['themeMode']) {
    ThemeController.setThemeMode(themeMode)
    setColorTheme(ThemeController.state.themeMode)
  }

  public setThemeVariables(themeVariables: ThemeControllerState['themeVariables']) {
    ThemeController.setThemeVariables(themeVariables)
    setThemeVariables(ThemeController.state.themeVariables)
  }

  public subscribeTheme(callback: (newState: ThemeControllerState) => void) {
    return ThemeController.subscribe(callback)
  }

  // -- Private ------------------------------------------------------------------
  private syncRequestedNetworks(chains: Chain[]) {
    // TODOX: generate network image url from chain id (walletConnect api)
    const requestedCaipNetworks: Web3Network[] = chains?.map(chain => ({
      id: chain.id.toString(),
      number: chain.id,
      name: chain.name,
      imageUrl: 'X',
      imageId: PresetsUtil.EIP155NetworkImageIds[chain.id]
    }))

    AccountController.setRequestedNetworks(requestedCaipNetworks)
  }

  private setIsAuthenticated: (typeof AccountController)['setIsAuthenticated'] =
    isAuthenticated => {
      AccountController.setIsAuthenticated(isAuthenticated)
    }

  private setWalletConnected: (typeof AccountController)['setWalletConnected'] = connected => {
    AccountController.setWalletConnected(connected)
  }

  private setDiditSession: (typeof AccountController)['setDiditSession'] = session => {
    AccountController.setDiditSession(session)
  }

  private syncDiditTokens: (typeof AccountController)['syncDiditTokens'] = () => {
    AccountController.syncDiditTokens()
  }

  private setWalletAddress: (typeof AccountController)['setWalletAddress'] = address => {
    AccountController.setWalletAddress(address)
  }

  private setAddressExplorerUrl: (typeof AccountController)['setAddressExplorerUrl'] = url => {
    AccountController.setAddressExplorerUrl(url)
  }

  private resetAccount: (typeof AccountController)['resetAccount'] = () => {
    AccountController.resetAccount()
  }

  private setNetwork: (typeof AccountController)['setNetwork'] = network => {
    AccountController.setNetwork(network)
  }

  private resetNetwork: (typeof AccountController)['resetNetwork'] = () => {
    AccountController.resetNetwork()
  }

  private resetWcConnection: (typeof ConnectionController)['resetWcConnection'] = () => {
    ConnectionController.resetWcConnection()
  }

  private initControllers(options: DiditClientOptions<CoreConfig>) {
    ConnectorController.setWcWallets(wcWallets)
    ConnectionController.setClient(options.connectionControllerClient)
    DiditAuthController.setClient(options.diditAuthControllerClient)
    ConfigurationController.setProjectId(
      options.projectId ?? ConstantsUtil.WALLET_CONNECT_PROJECT_ID
    )
    ConfigurationController.setClientId(options.clientId)
    ConfigurationController.setClaims(options.claims ?? ConstantsUtil.DIDIT_CLAIMS)
    ConfigurationController.setScope(options.scope ?? ConstantsUtil.DIDIT_SCOPE)
    ConfigurationController.setSdkVersion(options._sdkVersion)
    DiditApiController.setAuthBaseUrl(options.walletAuthBaseUrl)
    if (options.walletAuthorizationPath) {
      DiditApiController.setWalletAuthorizationPath(options.walletAuthorizationPath)
    }
    if (options.tokenAuthorizationPath) {
      DiditApiController.setTokenAuthorizationPath(options.tokenAuthorizationPath)
    }
    if (options.clientSecret) {
      ConfigurationController.setClientSecret(options.clientSecret)
    }

    if (options.redirectUri) {
      DiditApiController.setRedirectUri(options.redirectUri)
    }

    if (options.isStaging) {
      DiditApiController.setStaging(options.isStaging)
    }

    if (options.metadata) {
      ConfigurationController.setMetadata(options.metadata)
    }

    if (options.themeMode) {
      ThemeController.setThemeMode(options.themeMode)
    }

    if (options.themeVariables) {
      ThemeController.setThemeVariables(options.themeVariables)
    }
  }

  private syncNetwork(address?: Hex, chainId?: number, isConnected?: boolean) {
    const chain = this.wagmiConfig.chains.find((c: Chain) => c.id === chainId)

    if (chain || chainId) {
      const name = chain?.name ?? chainId?.toString()
      const id = Number(chain?.id ?? chainId)
      this.setNetwork({
        id: id.toString(),
        number: id,
        name,
        imageId: PresetsUtil.EIP155NetworkImageIds[id],
        imageUrl: 'TODO'
      })
      if (isConnected && address && chainId) {
        if (chain?.blockExplorers?.default?.url) {
          const url = `${chain.blockExplorers.default.url}/address/${address}`
          this.setAddressExplorerUrl(url)
        } else {
          this.setAddressExplorerUrl(undefined)
        }
      }
    }
  }

  private syncAccount({
    address,
    isConnected,
    chainId
  }: Pick<GetAccountReturnType, 'address' | 'isConnected' | 'chainId' | 'connector'>) {
    this.resetAccount()
    this.syncNetwork(address, chainId, isConnected)
    if (isConnected && address && chainId) {
      this.setWalletConnected(isConnected)
      this.setWalletAddress(address)
      this.hasSyncedConnectedAccount = true
    } else if (!isConnected && this.hasSyncedConnectedAccount) {
      this.resetWcConnection()
      this.resetNetwork()
    }
  }

  private syncConnectors(connectors: DiditClientOptions<CoreConfig>['wagmiConfig']['connectors']) {
    const uniqueIds = new Set()
    const filteredConnectors = connectors
      .filter(item => !uniqueIds.has(item.id) && uniqueIds.add(item.id))
      .filter(c => c.id !== 'injected')

    let web3Connectors: Web3Connector[] = []

    const coinbaseSDKId = ConstantsUtil.COINBASE_SDK_CONNECTOR_ID

    // Check if coinbase injected connector is present
    const coinbaseConnector = filteredConnectors.find(c => c.id === coinbaseSDKId)

    filteredConnectors.forEach(({ id, name, type, icon }) => {
      // If coinbase injected connector is present, skip coinbase sdk connector.
      const isCoinbaseRepeated =
        coinbaseConnector &&
        id === ConstantsUtil.CONNECTOR_RDNS_MAP[ConstantsUtil.COINBASE_CONNECTOR_ID]
      if (isCoinbaseRepeated) {
        web3Connectors = web3Connectors.filter(c => c.id !== coinbaseSDKId)
      }
      web3Connectors.push({
        id,
        explorerId: PresetsUtil.ConnectorExplorerIds[id],
        imageId: PresetsUtil.ConnectorImageIds[id],
        imageUrl: icon ?? '',
        name,
        type: PresetsUtil.ConnectorTypesMap[type] ?? 'EXTERNAL',
        info: {
          rdns: id
        }
      })
    })
    ConnectorController.setConnectors([...web3Connectors, ...socialConnectors])
  }

  private async syncDiditAuth() {
    if (CoreHelperUtil.isClient()) {
      const session = await DiditAuthController.getSession()
      if (session) {
        this.syncDiditTokens()
        this.setIsAuthenticated(true)
        this.setDiditSession(session)
      } else {
        this.setIsAuthenticated(false)
        this.setDiditSession(undefined)
      }
    }
  }

  private async initOrContinue() {
    if (!this.initPromise && !isInitialized && CoreHelperUtil.isClient()) {
      isInitialized = true
      this.initPromise = new Promise<void>(async resolve => {
        await Promise.all([import('@didit-sdk/ui'), import('./modal/didit-modal/index.js')])
        const modal = document.createElement('didit-modal')
        const toastContainer = document.createElement('didit-toast')
        document.body.insertAdjacentElement('beforeend', modal)
        document.body.insertAdjacentElement('beforeend', toastContainer)
        resolve()
      })
    }

    return this.initPromise
  }
}
