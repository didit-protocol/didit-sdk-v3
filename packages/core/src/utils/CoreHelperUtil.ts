import CryptoJS from 'crypto-js'
import type { Connector, LinkingRecord, SocialConnector, Web3Connector } from '../types/index.js'
import { ConstantsUtil } from './ConstantsUtil.js'
export const CoreHelperUtil = {
  isMobile() {
    if (typeof window !== 'undefined') {
      return Boolean(
        window.matchMedia('(pointer:coarse)').matches ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      )
    }

    return false
  },

  isAndroid() {
    const ua = window.navigator.userAgent.toLowerCase()

    return CoreHelperUtil.isMobile() && ua.includes('android')
  },

  isIos() {
    const ua = window.navigator.userAgent.toLowerCase()

    return CoreHelperUtil.isMobile() && (ua.includes('iphone') || ua.includes('ipad'))
  },

  isClient() {
    return typeof window !== 'undefined'
  },

  isPairingExpired(expiry?: number) {
    return expiry ? expiry - Date.now() <= ConstantsUtil.TEN_SEC_MS : true
  },

  isAllowedRetry(lastRetry: number) {
    return Date.now() - lastRetry >= ConstantsUtil.ONE_SEC_MS
  },

  copyToClopboard(text: string) {
    navigator.clipboard.writeText(text)
  },

  getPairingExpiry() {
    return Date.now() + ConstantsUtil.FOUR_MINUTES_MS
  },

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://')
  },

  formatNativeUrl(appUrl: string, wcUri: string): LinkingRecord {
    if (CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri)
    }
    let safeAppUrl = appUrl
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '')
      safeAppUrl = `${safeAppUrl}://`
    }
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`
    }
    const encodedWcUrl = encodeURIComponent(wcUri)

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      href: safeAppUrl
    }
  },

  formatUniversalUrl(appUrl: string, wcUri: string): LinkingRecord {
    if (!CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri)
    }
    let safeAppUrl = appUrl
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`
    }
    const encodedWcUrl = encodeURIComponent(wcUri)

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      href: safeAppUrl
    }
  },

  openHref(href: string, target: '_blank' | '_self' | 'popupWindow', features?: string) {
    window.open(href, target, features || 'noreferrer noopener')
  },

  returnOpenHref(href: string, target: '_blank' | '_self' | 'popupWindow', features?: string) {
    return window.open(href, target, features || 'noreferrer noopener')
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseError(error: any): string {
    if (typeof error === 'string') {
      return error
    } else if (typeof error?.detial === 'string') {
      return error.detail
    } else if (error instanceof Error) {
      return error.message
    }

    return 'Unknown error'
  },

  isAddress(address: string): boolean {
    if (!/^(?:0x)?[0-9a-f]{40}$/iu.test(address)) {
      return false
    } else if (/^(?:0x)?[0-9a-f]{40}$/iu.test(address) || /^(?:0x)?[0-9A-F]{40}$/iu.test(address)) {
      return true
    }

    return false
  },

  isWeb3Connector(connector: Connector): connector is Web3Connector {
    return 'info' in connector
  },

  isSocialConnector(connector: Connector): connector is SocialConnector {
    return 'provider' in connector
  },

  generateCodeVerifier() {
    const codeVerifier = CryptoJS.lib.WordArray.random(128 / 8).toString()

    return codeVerifier
  },

  generateCodeChallenge(verifier: string) {
    // eslint-disable-next-line new-cap
    const hashed = CryptoJS.SHA256(verifier).toString(CryptoJS.enc.Base64)
    // eslint-disable-next-line require-unicode-regexp
    const base64Url = hashed.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, '')

    return base64Url
  },

  isValidClaimsString(claims: `${string}:${string}`) {
    // eslint-disable-next-line prefer-named-capture-group, require-unicode-regexp
    const claimsRegex = /^(\w+:\w+)(\s\w+:\w+)*$/
    if (!claimsRegex.test(claims)) {
      return false
    }

    return true
  },

  isValideScopeString(scope: string) {
    // eslint-disable-next-line prefer-named-capture-group, require-unicode-regexp
    const scopeRegex = /^(\w+)(\s\w+)*$/
    if (!scopeRegex.test(scope)) {
      return false
    }

    return true
  },

  getDiditAuthStatus(isAuthenticated?: boolean) {
    if (isAuthenticated) {
      return 'authenticated'
    }

    return isAuthenticated === undefined ? 'loading' : 'unauthenticated'
  },

  isFullURL(url: string) {
    // Regular expression to match a full URL
    // eslint-disable-next-line prefer-named-capture-group, require-unicode-regexp
    const urlPattern = /^(https?:\/\/)?((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/.*)?$/

    return urlPattern.test(url)
  },

  isPath(path: string) {
    // Regular expression to match a file path (absolute or relative)
    // eslint-disable-next-line require-unicode-regexp, prefer-named-capture-group
    const pathPattern = /^(\/|\.\/|\.\.\/|([a-zA-Z]:\\)).*$/

    return pathPattern.test(path)
  }
}
