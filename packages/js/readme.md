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

## Installation

install didit-sdk and its peer dependencies, @wagmi/core, viem and @wagmi/connectors. check [how install wagmi/core](https://1.x.wagmi.sh/core/getting-started) for more

```bash copy
npm i @didit-sdk/js @wagmi/connectors @wagmi/core viem
```

### Configure your didit app

Create an app at [Business Console](https://business.didit.me) and obtain your clientid and client secret

### Implementation

For a quick integration you can use defaultWagmiConfig function which wraps Wagmi's createConfig function with a predefined configuration. This includes WalletConnect, Coinbase and Injected connectors

In your main.ts file set up the following configuration.

```js copy
import { arbitrum, mainnet } from '@wagmi/core/chains'
import { createDiditSdk, defaultWagmiConfig } from '@didit-sdk/js'
import { reconnect } from '@wagmi/core'

// Get cleintId from https://business.didit.me
export const clientId = 'k234y324hjsds'

// 1. Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata: {
    name: 'Js Example',
    url: 'https://didit.me'
  }
})

reconnect(wagmiConfig)

// 2. Create didit sdk
const diditSDk = createDiditSdk({
  wagmiConfig,
  clientId,
  themeMode: 'dark'
})
```

### Trigger the modal

To open didit-sdk modal you can use our web component or build your own button with the sdk actions. In this example we are going to use the `<didit-button>` component.

Web components are global html elements that don't require importing.

```html {8} copy
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>HTML Example</title>
  </head>
  <body>
    <didit-button></didit-button>
    <didit-callback></didit-callback>
    <script type="module" src="main.ts"></script>
  </body>
</html>
```

> `<didit-callback>` component is essential for socials auth to work check [components](/components#didit-callback-) for more

## Actions

Actions are functions that will help you control the modal, subscribe to status change

### Open and close the modal

```js copy
const diditSdk = createDiditSdk({ wagmiConfig, clienId })

diditSdk.open()

diditSdk.close()
```

### Signout

```js copy
diditSDk.signOut()
```

### Didit State

authentication state

```js copy
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

Didit state is an object of the following properties:

<br />

<table>
  <thead>
    <tr>
      <th scope="col">Property</th>
      <th scope="col">Description</th>
      <th scope="col">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">`isAuthenticated`</th>
      <td>Whether the user is authenticated or not. will be undefined when the user authenticating or when checking user session on page load</td>
      <td>`boolean` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`status`</th>
      <td>A string representation of the auth status `loading` | `authenticated` | `unauthenticated`</td>
      <td>`DiditAuthStatus`</td>
    </tr>
    <tr>
      <th scope="row">`authMethod`</th>
      <td>The auth method used by the user if is authenticated: `wallet` | `apple` | `google`</td>
      <td>`DiditAuthType` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`user`</th>
      <td>The current conncted didit user</td>
      <td>`DiditUser` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`accessToken`</th>
      <td>The current **Didit** access token</td>
      <td>`string` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`refreshToken`</th>
      <td>The current **Didit** refresh token</td>
      <td>`string` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`isWalletConnected`</th>
      <td>A quick way to check if user connected with wallet address </td>
      <td>`boolean`</td>
    </tr>
    <tr>
      <th scope="row">`walletAddress`</th>
      <td>The current connected wallet address if the user is authneticated with wallet address</td>
      <td>`string` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`addressExplorerUrl`</th>
      <td>Explorer url of the current connected wallet</td>
      <td>`string` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`selectedNetworkId`</th>
      <td>The current connected chain id example: 1 (Ethereum)</td>
      <td>`number` | `undefined`</td>
    </tr>
    <tr>
      <th scope="row">`selectedNetworkName`</th>
      <td>The current connected chain name example: Ethereum (1)</td>
      <td>`string` | `undefined`</td>
    </tr>
  </tbody>
</table>

### Ethereum Library

You can use [Wagmi actions](https://wagmi.sh/core/api/actions/getAccount) to sign messages, interact with smart contracts, and much more.

#### signMessage

Action for signing messages with connected account

```js copy
import { signMessage } from '@wagmi/core'
import { wagmiConfig } from './main'

await signMessage(wagmiConfig, { message: 'hello world' })
```

> Check more on **_[wagmi](https://wagmi.sh/core/api/actions/readContract)_** docs

### Modal State

Get the current value of the modal's state

```js copy
diditSDk.subscribeDiditModalState(({ isLoading, isOpen }) => {
  console.log({
    isLoading,
    isOpen
  })
})

// or

const { isLoading, isOpen } = diditSDk.getDiditModalState()
```

The modal state is an object of two properties:

<br />

<table>
  <thead>
    <tr>
      <th scope="col">Property</th>
      <th scope="col">Description</th>
      <th scope="col">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">`isLoading`</th>
      <td>Open state will be true when the modal is open and the user is authenticating</td>
      <td>`boolean`</td>
    </tr>
    <tr>
      <th scope="row">`isOpen`</th>
      <td>Open state will be true when the modal is open and false when closed.</td>
      <td>`boolean`</td>
    </tr>
  </tbody>
</table>

### ThemeMode

Set the `themeMode` after creating the sdk instance

```js {3} copy
const diditSDk = createDiditSdk({ wagmiConfig, clientId })

diditSDk.setThemeMode('dark')
```

Get the current `themeMode` value by calling the `getThemeMode` function

```js {3} copy
const diditSDk = createDiditSdk({ wagmiConfig, clientId })

const themeMode = diditSDk.getThemeMode()
```

### themeVariables

Set the `themeVariables` after creating the sdk instance

```js {3} copy
const diditSdk = createDiditSdk({ wagmiConfig, projectId })

diditSdk.setThemeVariables({ ... })
```

Get the current `themeVariables` value by calling the `getThemeVariables` function

```js {3} copy
const diditSdk = createDiditSdk({ wagmiConfig, projectId })

const themeMode = diditSdk.getThemeVariables()
```

### Subscribe to theme changes

```js copy
const unsubscribe = diditSdk.subscribeTheme(newTheme => console.log(newTheme))
```

> for more check [didit Docs](https://docs.didit.me/docs/unified-access-sdk)
