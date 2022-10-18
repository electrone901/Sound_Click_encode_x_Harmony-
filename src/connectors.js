import { UAuthMoralisConnector } from '@uauth/moralis'

// Instantiate your other connectors.
export const injected = {}

export const walletconnect = { provider: 'walletconnect' }

// This info comes from unstoppable dashboard
UAuthMoralisConnector.setUAuthOptions({
  clientID: "66e7182b-b397-4b8b-905a-be32eab9da67",
  redirectUri: "https://sound-click.netlify.app/",
  scope: "openid wallet",
  // Scope must include openid and wallet
  // Injected and walletconnect connectors are required
  connectors: { injected, walletconnect },
})

export const uauth = { connector: UAuthMoralisConnector }

const connectors = {
  uauth,
}

export default connectors

// import { UAuthMoralisConnector } from '@uauth/moralis'

// // Instantiate your other connectors.
// export const injected = {}

// export const walletconnect = { provider: 'walletconnect' }

// UAuthMoralisConnector.setUAuthOptions({
//   clientID: '7f929f6c-5b4c-4fc6-a803-a56cc3de94da',
//   redirectUri: 'http://localhost:3000',
//   // fallbackIssuer: process.env.REACT_APP_FALLBACK_ISSUER!,
//   // Scope must include openid and wallet
//   scope: 'openid wallet',
//   // Injected and walletconnect connectors are required
//   connectors: { injected, walletconnect },
// })

// export const uauth = { connector: UAuthMoralisConnector }

// // add it
// const connectors = {
//   uauth,
// }

// export default connectors
