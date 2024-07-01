import { customElement } from '@didit-sdk/ui'
import { LitElement } from 'lit'

@customElement('didit-callback')
export class DiditCallback extends LitElement {
  public constructor() {
    super()
  }

  public override connectedCallback() {
    super.connectedCallback()
    this.getDiditAuthCodeFromUrl()
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return null
  }

  // -- Private ------------------------------------------- //
  private getDiditAuthCodeFromUrl() {
    const windowLocation = window?.location
    const urlSearchParams = new URLSearchParams(windowLocation.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    const _authorizationCode = params['code']
    const authorizationError = params['error']
    const authorizationErrorDescription = params['error_description']

    if (_authorizationCode) {
      urlSearchParams.delete('code')
      window?.history.replaceState({}, '', windowLocation.pathname)
      // Send code to parent window
      window?.opener.postMessage(
        {
          code: _authorizationCode,
          source: 'didit-popup'
        },
        windowLocation.origin
      )
    } else if (authorizationError) {
      urlSearchParams.delete('error')
      urlSearchParams.delete('error_description')
      window?.history.replaceState({}, '', windowLocation.pathname)
      // Send error to parent window
      window?.opener?.postMessage(
        {
          error: authorizationError,
          errorDescription: authorizationErrorDescription,
          source: 'didit-popup'
        },
        windowLocation.origin
      )
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-callback': DiditCallback
  }
}
