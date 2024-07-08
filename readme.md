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

for more check [didit Docs](https://docs.didit.me/docs/unified-access-sdk)
