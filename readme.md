<a href="https://docs.didit.me/docs/sdk">
  <img alt="didit-sdk" src="https://docs.didit.me/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsdk_works.5dcf3190.png&w=3840&q=75" />
</a>

# Didit-SDK

**The easiest way to connect to [Didit protocol](https://docs.didit.me/)**

Didit-SDK is a library that makes it easy to add wallet connection to your dapp.

- ✅ **Didit** User Authentication flow
- 🎉 Support for multiple frameworks. Easily integrate with [React](https://reactjs.org/) and vanilla JavaScript. Vue and Svelte are comming soon...
- 🔥 Out-of-the-box wallet management
- 🚀 [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963). support for browser extension wallets.
- 🎨 Easily customizable UI. light/dark or make it match your brand
- 🦄 Built on top of [wagmi](https://wagmi.sh)

## Repository

Didit SDK [Github Repo](https://github.com/didit-protocol/didit-sdk-v3)

## Try it out

You can use the CodeSandbox links below try out **Didit** Sdk:

- with [js](https://codesandbox.io/p/sandbox/github/rainbow-me/rainbowkit/tree/main/examples/with-vite) // TODO: setup example on codesandbox

- with [react](https://codesandbox.io/p/sandbox/github/rainbow-me/rainbowkit/tree/main/examples/with-vite) // TODO: setup example on codesandbox

- with [nextjs](https://codesandbox.io/p/sandbox/github/rainbow-me/rainbowkit/tree/main/examples/with-vite) // TODO: setup example on codesandbox

### Examples

The following examples are provided in the [examples](./examples/) folder of this repo.

- `js`
  example of @didit-sdk/js and how to integrate it with vanilla js

- `react`
  example of @didit-sdk/react and how to integrate it with vite/react.js

- `next`
  example of @didit-sdk/react and how to use it in next.js with ssr

### Running examples

To run an example locally, install dependencies.

```bash
pnpm install
```

Then run the dev script. change examples:js with the example you want to run (examples:react/examples:next)

```bash
pnpm watch && pnpm examples:js
```

### Installation

#### Integrate didit-sdk into your project

#### Vannila JS

install didit-sdk and its peer dependencies, @wagmi/core, viem and @wagmi/connectors. check [how install wagmi/core](https://1.x.wagmi.sh/core/getting-started) for more

```bash
npm @didit-sdk/js @wagmi/connectors @wagmi/core viem
```

#### Configure your didit app

Create an app at [Didit Console](https://business.didit.me) and obtain your clientid and client secret

#### Implementation

For a quick integration you can use defaultWagmiConfig function which wraps Wagmi's createConfig function with a predefined configuration. This includes WalletConnect, Coinbase and Injected connectors

In your main.ts file set up the following configuration.

```tsx
import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiConfig } from '@didit-sdk/js'
import { reconnect } from '@wagmi/core'


// 1. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  projectId: 'wallet-connect-project-id-if-you-have-one'
  chains: [mainnet, arbitrum],
})

reconnect(wagmiConfig)

// 3. Create diditsdk istance
const diditSdk = createDiditSdk({
  wagmiConfig,
  clientId
  metadata: {
    name: 'Js Example',
    clientId: 'your-client-id-from-didit-console',
    clientSecret: 'your-client-secret-from-didit-console',
    redirectUri: 'yout-redirect-uri-from-didit-console',
  },
  themeMode: 'dark',
})

```

#### Trigger the modal

To open didit-sdk modal you can use our web component or build your own button with the sdk actions. In this example we are going to use the <didit-button /> component.

Web components are global html elements that don't require importing.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>HTML Example</title>
  </head>
  <body>
    <didit-button></didit-button>
    <script type="module" src="main.ts"></script>
  </body>
</html>
```

### Actions

Actions are functions that will help you control the modal, subscribe to status change

#### Open and close the modal

```js
const diditSDk = createDiditSdk({ wagmiConfig, clientId })

diditSDk.openModal()

diditSDk.closeModal()
```

#### Signout

```js
diditSDk.signOut()
```

#### DiditState

```js
diditSDk.subscribeDiditState(({ isAuthenticated, accessToken, user }) => {
  console.log({
    isAuthenticated,
    accessToken,
    user
  })
})

// or

const { isAuthenticated, accessToken, user } = diditSDk.getDiditState()
```

##### Configure Didit provider

1. Set up the `DiditAuthProvider` with minimum configurable props:

- `clientId`: Your **Didit** client id
- `redirectUri`: The redirect URI of your app. This is where the user will be redirected after authentication. It must be registered in your **Didit** client configuration and should be a valid page in your app.

```tsx
import { DiditAuthProvider} from 'didit-sdk';

...

      <DiditAuthProvider
        clientId="676573"
        redirectUri="http://your-app.com/login/callback"
      >
        {children}
      </DiditAuthProvider>
```

2. Didit supports multiple authentication methods. You can configure the `DiditAuthProvider` with the authentication methods you want to enable for your users. There are email base methods and wallet method, which can be configured with the following props:

Additionally you can configure your **Didit** connection with more custom props:

- `authMethods`: The authentication methods you want to enable for your users (Default: `['google', 'apple', 'wallet']`)
- `authBaseUrl`: The base URL of a custom backend with **Didit** auth for email based authentication methods and token revalidation (Default: `https://apx.didit.me/auth`)
- `walletAuthBaseUrl`: The base URL of your custom backend with **Didit** auth for wallet auth method (Default: `https://apx.didit.me/auth`)
- `emailAuthMode`: The mode of the email based authentication methods. It can be either `popup` or `redirect` (Default: `popup`)
- `walletAuthorizationPath`: Custom path for wallet authorization endpoint (Default: `/v2/wallet-authorization/`)
- `tokenAuthorizationPath`: Custom path for token endpoint (Default: `/v2/token/`)
- `claims`: The claims you want to request from your users (Default: `"read:email"`)
- `scope`: The scopes you want to request from your users (Default: `"openid"`)

3. Additionally you can configure the `DiditAuthProvider` with the some callbacks to customize your authentication flow:

- `onError`: A callback function that will be called when an error occurs during the authentication process
- `onLogin`: A callback function that will be called when the user successfully logs in
- `onLogout`: A callback function that will be called when the user successfully logs out

```tsx
import { DiditAuthProvider, DiditAuthMethod,  } from 'didit-sdk';

...
      <DiditAuthProvider
        authMethods={[DiditAuthMethod.APPLE, DiditAuthMethod.GOOGLE]}
        authBaseUrl="https://apx.staging.didit.me/auth"
        walletAuthBaseUrl="https://my.didit.app/auth/wallet"
        clientId="676573"
        claims="read:email read:blockchain"
        scope="openid"
        emailAuthMode={DiditEmailAuthMode.REDIRECT}
        walletAuthorizationPath="/wallet-authorization/"
        tokenAuthorizationPath="/token/"
        onLogin={(_authMethod?: DiditAuthMethod) =>
          console.log('Logged in Didit with', _authMethod)
        }
        onLogout={() => console.log('Logged out Didit')}
        onError={(_error: string) => console.error('Didit error: ', _error)}
      >
```

##### Configure Wagmi

In case you want to use the wallet authentication method, You will also need to configure your desired chains, generate the required connectors and setup a `wagmi` config

> Note: Every dApp that relies on WalletConnect now needs to obtain a `projectId` from [WalletConnect Cloud](https://cloud.walletconnect.com/). This is absolutely free and only takes a few minutes.

```tsx line=4-99
...
import { getDefaultWallets } from 'didit-sdk';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'App with Didit',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})
```

[Read more about configuring chains & providers with `wagmi`](https://wagmi.sh/docs/providers/configuring-chains).

1. Set up [`WagmiConfig`](https://wagmi.sh/docs/provider):

Pass the next parameters to the `DiditAuthProvider` provider:

- `chains`: Wagmi config of the requested chain [i.e: wagmiConfig.chains]
- `theme`: theme function to customize RainbowKit UI to match your branding.
  there are 3 built-in theme functions:
  - `lightTheme` &nbsp; (default)
  - `darkTheme`
  - `midnightTheme`
    refer to [RainbowKit Theming](https://www.rainbowkit.com/docs/theming) for more.

```tsx
<WagmiConfig
  config={wagmiConfig} // The one that was configured before for Wagmi
>
  <DiditAuthProvider clientId="676573" chains={chains} theme={lightTheme()}>
    {children}
  </DiditAuthProvider>
</WagmiConfig>
```

##### Wrap all providers

Wrap your application with `WagmiConfig` and `DiditAuthProvider` providers in the following order and way:

```tsx
const App = () => {
  return (
    <WagmiConfig
      config={wagmiConfig} // The one that was configured before for Wagmi
    >
      <DiditAuthProvider clientId="676573" chains={chains} theme={lightTheme()}>
        {children}
      </DiditAuthProvider>
    </WagmiConfig>
  )
}
```

#### Manage authentication

##### Add default Didit login and logout components

1. Add the `DiditLoginButton` component to your app using a authentication method:

```tsx
import { DiditLoginButton, DiditAuthMethod } from 'didit-sdk';

...

  <DiditLoginButton
    label="Connect with Didit"
    authMethod={DiditAuthMethod.GOOGLE}
  />
```

2. Add the `DiditLogoutButton` component to your app:

```tsx
import { DiditLogoutButton } from 'didit-sdk';

...

  <DiditLogoutButton
    label="Logout from Didit"
  />
```

3. Additionally you can use the `DiditLogin` component to provide multiple authentication methods. You can also configure it with:

- `mode`: The mode of the login component (`modal` or `embedded`) (default: `modal`)
- `title`: the title of the login dialog (`string`) (default: `Sign in with Didit`)
- `description:` the description of the login dialog (`string`) (default: `<empty string>`)

```tsx
import { DiditLogin, DiditLoginMode } from 'didit-sdk';

...

  <DiditLogin
    mode={ DiditLoginMode.MODAL }
    isModalOpen={isLoginModalOpen}
    onModalClose={() => setIsLoginModalOpen(false)}
  />
```

```tsx
import { DiditLogin } from 'didit-sdk';

...

  <DiditLogin mode={ DiditLoginMode.EMBEDDED } />
```

> The `DiditLogin` is automatically configured with the authentication methods you provided to the `DiditAuthProvider` provider.

#### Retrieve the authentication status

You can use the `useDiditAuth` hook to retrieve the authentication status and current connection;

- `authMethod`: The current authentication method being used

  ```tsx
  import { DiditAuthMethod } from 'didit-sdk'
  ```

- `status`: The current authentication status ('loading', 'authenticated', 'unauthenticated')

  ```tsx
  import { DiditAuthStatus } from 'didit-sdk'
  ```

- `accessToken`: The current **Didit** access token
- `refreshToken`: The current **Didit** refresh token
- `isAuthenticated`: Whether the user is authenticated or not
- `walletAddress`: The current user's wallet address if connected by the wallet auth method
- `error`: The current error in authentication process if any
- `user : { identifier: <email | walletAddress>, identifierType: <"email" | "wallet" }`: the user identifier based on the user login method

```tsx
import { useDiditAuth } from 'didit-sdk';

...
  const { authMethod, status, accessToken, isAuthenticated, walletAddress, error } = useDiditAuth();

  return (
    <div>
      <p>Auth method: {authMethod}</p>
      <p>Status: {status}</p>
      <p>Token: {accessToken}</p>
      <p>Is authenticated: {isAuthenticated}</p>
      <p>Address: {walletAddress}</p>
      <p>Error: {error}</p>
    </div>
  );
```

##### Customize the authentication flow

Additonally you can customize the **Didit** authentication flow by also using rest of the values returned by the `useDiditAuth` hook:

```tsx
import { useDiditAuth } from 'didit-sdk';

...

const {
    authMethod,
    availableAuthMethods,
    error,
    hasError,
    isAuthenticated,
    isLoading,
    login,
    loginWithApple,
    loginWithEmail,
    loginWithGoogle,
    loginWithSocial,
    loginWithWallet,
    logout,
    status,
    token,
    tokenData,
    user,
    walletAddress, // if the user is connected with wallet method
} = useDiditAuth({
  onError: (error: string) => console.error('Didit error: ', error),
  onLogin: (authMethod?: string) => console.log('Logged in Didit with', authMethod),
  onLogout: () => console.log('Logged out Didit')
});

return (
  <button
    id="custom-Didit-login-button"
    onClick={() => {
      if (isAuthenticated) {
        logout();
      } else {
        loginWithWallet();
      }
    }}
    disabled={ isAuthenticating === undefined }
  >
    {isAuthenticated ? 'Logout' : 'Login'}
  </button>
  <div>
    <p>Auth method: {authMethod}</p>
    <p>Status: {status}</p>
    <p>Token: {token}</p>
    <p>Is authenticated: {isAuthenticated}</p>
    <p>User identifier: {user?.identifier}</p>
    <p>Identifier type: {user?.identifierType}</p>
  </div>
)

```

##### Special cases

###### App with localized routing

In case you have localized routing in your app there are two possible ways to configure the `redirectUri` prop in the `DiditAuthProvider`:

1. You create a single page and route withouth localization and use the `redirectUri` prop as usual:

```tsx
import { DiditAuthProvider } from 'didit-sdk';

...

  <DiditAuthProvider
    clientId="676573"
    redirectUri="http://your-app.com/no-locale-login/callback"
  >
    {children}
  </DiditAuthProvider>
```

2. You can use a dynamic `redirectUri` prop based on the current language or locale:

```tsx

import { DiditAuthProvider } from 'didit-sdk';

...

  <DiditAuthProvider
    clientId="676573"
    redirectUri={`http://your-app.com/${locale}/login/callback`}
  >
    {children}
  </DiditAuthProvider>
```

> Note: In case you use the second option, you will need to add each of the `redirectUri` to your **Didit** client configuration for each language or locale to support all the possible routes.
