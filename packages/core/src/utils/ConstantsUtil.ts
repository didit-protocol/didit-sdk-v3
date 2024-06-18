export const ConstantsUtil = {
  // Web3 wallets
  WALLET_CONNECT_CONNECTOR_ID: 'walletConnect',
  INJECTED_CONNECTOR_ID: 'injected',
  COINBASE_CONNECTOR_ID: 'coinbaseWallet',
  COINBASE_SDK_CONNECTOR_ID: 'coinbaseWalletSDK',
  SAFE_CONNECTOR_ID: 'safe',
  LEDGER_CONNECTOR_ID: 'ledger',
  EIP6963_CONNECTOR_ID: 'eip6963',
  CONNECTOR_RDNS_MAP: {
    coinbaseWallet: 'com.coinbase.wallet'
  } as Record<string, string>,

  // Timeouts
  TWO_MINUTES_MS: 120_000,
  FOUR_MINUTES_MS: 240_000,
  FIVE_MINUTES_S: 300,
  TEN_SEC_MS: 10_000,
  ONE_SEC_MS: 1_000,

  // DIDIT AUTH API
  DIDIT_BASE_AUTH_URL: 'https://apx.staging.didit.me',
  DIDIT_WALLET_AUTH_PATH: '/auth/v2/wallet-authorization/',
  DIDIT_WALLET_TOKEN_PATH: '/auth/v2/token/',
  DIDIT_WALLET_GRANNT_TYPE: 'connect_wallet',
  DIDIT_REFRESH_GRANT_TYPE: 'refresh_token',
  DIDIT_INTROSPECT_PATH: '/auth/v2/introspect/',
  DIDIT_CLAIMS: 'read:email' as `${string}: ${string}`,
  DIDIT_SCOPE: 'openid',
  DIDIT_EMAIL_AUTH_PATH: 'auth/oidc/authorize/',
  DIDIT_EMAIL_TOKEN_PATH: 'auth/oidc/token/',
  DIDIT_EMAIL_LOGOUT_PATH: 'auth/oidc/logout/',
  DIDIT_EMAIL_GRANNT_TYPE: 'authorization_code',
  DIDIT_EMAIL_RESPONSE_TYPE: 'code',
  DIDIT_AUTH_REDIRECT_URL: 'http://localhost:3000/callback',
  DIDIT_EMAIL_CODE_CHALLENGE_METHOD: 'S256',
  DIDIT_EMAIL_POPUP_WIDTH: 400,
  DIDIT_EMAIL_POPUP_HEIGHT: 600,

  // Wc assets api
  WC_ASSETS_API_URL: 'https://explorer-api.walletconnect.com/',
  WC_ASSETS_API_WALLET_LOGO_PATH: '/v3/logo/md/',

  // SDK
  DIDIT_SKD_VERSION: '0.0.1'
}
