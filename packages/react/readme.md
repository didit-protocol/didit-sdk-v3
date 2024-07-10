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

## React Installation

install didit-sdk and its peer dependencies, wagmi, viem and @tanstack/react-query

```bash copy
npm i @didit-sdk/react wagmi viem @tanstack/react-query
```

### Configure your didit app

Create an app at [Business Console](https://business.didit.me) and obtain your clientid and client secret

### Implementation

For a quick integration you can use defaultWagmiConfig function which wraps Wagmi's createConfig function with a predefined configuration. This includes WalletConnect, Coinbase and Injected connectors
In your main.ts file set up the following configuration.

On top of your app set up the following configuration, making sure that all functions are called outside any React component to avoid unwanted rerenders.

```js copy
import { arbitrum, mainnet } from 'wagmi/chains'
import { defaultWagmiConfig, createDiditSdk } from '@didit-sdk/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

// Get cleintId from https://business.didit.me
const clientId = process.env.DIDI_CLIENT_ID

// 1. Setup queryClient
const queryClient = new QueryClient()

// 2. Create wagmiConfig
const metadata = {
  name: 'React Example',
  url: 'https://react-example.me'
}

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata
})

// 3. creat didit sdk
createDiditSdk({
  wagmiConfig,
  clientId,
  metadata
})

export default function DiditSdkProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

> `<didit-callback>` component is essential for socials auth to work check [components](/components#didit-callback-) for more

## Next.js

#### Wagmi config

Create a new file for your Wagmi configuration, since we are going to be calling this function on the client and the server it cannot live inside a file with the 'use client' directive.

For this example we will create a file called `config/index.tsx` outside our app directory and set up the following configuration

```js copy
import { arbitrum, mainnet } from 'wagmi/chains'
import { defaultWagmiConfig } from '@didit-sdk/react'
import { cookieStorage, createStorage } from 'wagmi'

// Get cleintId from https://business.didit.me
const clientId = process.env.NEXT_PUBLIC_DIDI_CLIENT_ID

// 2. Create wagmiConfig
const metadata = {
  name: 'React Example',
  url: 'https://react-example.me'
}

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum],
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})
```

>  <ul className="mt-4">

    → Notice that we are using here the [recommended configuration from Wagmi for SSR.](https://wagmi.sh/react/guides/ssr)
    → Using cookies is completely optional and by default Wagmi will use `localStorage` instead if the `storage` param is not defined.
    → The `ssr` flag will delay the hydration of the Wagmi's store to avoid hydration mismatch errors.

  </ul>

#### Context Provider

Let's create now a context provider that will wrap our application and initialized DiditSdk (`createDiditSdk` needs to be called inside a React Client Component file).

In this example we will create a file called `context/index.tsx` outside our app directory and set up the following configuration

```tsx copy
use client'

import React, { ReactNode } from 'react'
import { config, clientId, metadata } from '@/config'

import { createDiditSdk } from '@didit-sdk/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

// Create sdk instance
createDiditSdk({
  wagmiConfig: config,
  clientId,
  metadata,
})

export default function DiditSdkProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

#### Layout

Next, in our `app/layout.tsx` file, we will import our `DiditSdkProvider` component and call the [Wagmi's function](https://wagmi.sh/react/guides/ssr#_2-hydrate-the-cookie) `cookieToInitialState`.

The `initialState` returned by `cookieToInitialState`, contains the optimistic values that will populate the Wagmi's store both on the server and client.

Hooks are functions that will help you control the sdk modal, subscribe to user session.

```tsx copy
import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { config } from '@/config'
import DiditSdkProvider from '@/context'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body>
        <DiditSdkProvider initialState={initialState}>{children}</DiditSdkProvider>
      </body>
    </html>
  )
}
```

#### Callback

OAuth authentication require a redirection to the client application. `redirectUri` in the config should be a page in our app.

Let's create `app/callback/index.tsx` and add `<didit-callback>` web component

```tsx
export default function Page() {
  return <didit-callback></didit-callback>
}
```

> Web components are global html elements that don't require importing.

### Trigger the modal

To open DiditSdk modal you can use our web component or build your own button with DiditSdk hooks. In this example we are going to use the `<didit-button>` component.

Web components are global html elements that don't require importing.

```html copy
export default function ConnectButton() { return <didit-button /> }
```

### Trigger the modal

To open DiditSdk modal you can use our web component or build your own button with DiditSdk hooks. In this example we are going to use the `<didit-button>` component.

Web components are global html elements that don't require importing.

```html copy
export default function ConnectButton() { return <didit-button /> }
```

## Hooks

Hooks are functions that will help you control the sdk modal, subscribe to user session.

### useDiditSdk

Control the sdk modal with the `useDiditSdk` hook

```tsx copy
import { useDiditSdk } from '@didit-sdk/react'

export default function Component() {
  const { isOpen, openModal, closeModal } = useDiditSdk()

  openModal()

  //...
}
```

DiditSdk state includes:
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

### useDiditSignOut

```tsx copy
import { useDiditSignOut } from '@didit-sdk/react'

const signOut = useDiditSignOut()
```

### useDiditState

get Didit session state

```tsx copy
import { useDiditState } from '@didit-sdk/react'

const { user, status, isAuthenticated, authMethod, selectedNetworkName } = useDiditState()
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

### useDiditSdkTheme

```tsx copy
import { useDiditSdkTheme } from '@didit-sdk/react'

export default function Component() {
  const { setThemeMode, themeMode, setThemeVariables, themeVariables } = useDiditSdkTheme()

  setThemeMode('dark')

  setThemeVariables({
    primaryColor: '#00BB7F'
  })
}
```

### Ethereum Library

You can use [Wagmi hooks](https://wagmi.sh/react/api/hooks) to sign messages, interact with smart contracts, and much more.

#### useSignMessage

Hook for signing messages with connected account.

```js copy
import { useSignMessage } from 'wagmi'

function App() {
  const { signMessage } = useSignMessage()

  return <button onClick={() => signMessage({ message: 'hello world' })}>Sign message</button>
}
```

> Check more on [wagmi](https://wagmi.sh/react/api/hooks/useConnect) docs

> For more readt [Didit Sdk docs](https://docs.didit.me/docs/sdk)
