import { useDiditState, useDiditSignOut } from '@didit-sdk/react'
import { useState } from 'react'

export function UserStatus() {
  const signOut = useDiditSignOut()
  const diditAccount = useDiditState()
  console.log('--->', diditAccount)
  const { user, status, isAuthenticated, accessToken, selectedNetworkName } = diditAccount
  const [isTokenCopied, setIsTokenCopied] = useState(false)
  const [isAddressCopied, setIsAddressCopied] = useState(false)

  const handleCopyToken = () => {
    navigator.clipboard.writeText(accessToken || '')
    setIsTokenCopied(true)
    setTimeout(() => {
      setIsTokenCopied(false)
    }, 2000)
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user?.identifier || '')
    setIsAddressCopied(true)
    setTimeout(() => {
      setIsAddressCopied(false)
    }, 2000)
  }

  return (
    <div className="user-card">
      <h3>didit state</h3>
      <h5>status</h5>
      <p>{status}</p>
      <div className="copy-wrapper">
        <label htmlFor="npm-install" className="sr-only">
          <h5>user Address</h5>
        </label>
        <div className="copy-value">
          <input id="npm-install" type="text" value={user?.identifier || ''} disabled readOnly />
          <button type="button" className="copy-button" onClick={handleCopyAddress}>
            {isAddressCopied ? (
              <>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span id="success-message">Copied!</span>
              </>
            ) : (
              <span id="default-message">Copy</span>
            )}
          </button>
        </div>
      </div>
      <div className="copy-wrapper">
        <label htmlFor="npm-install" className="sr-only">
          <h5>accessToken</h5>
        </label>
        <div className="copy-value">
          <input id="npm-install" type="text" value={accessToken || ''} disabled readOnly />
          <button type="button" className="copy-button" onClick={handleCopyToken}>
            {isTokenCopied ? (
              <>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span id="success-message">Copied!</span>
              </>
            ) : (
              <span id="default-message">Copy</span>
            )}
          </button>
        </div>
      </div>
      <h5>selectedNetworkName</h5>
      <p>{selectedNetworkName}</p>
      {isAuthenticated && (
        <button type="button" id="error-btn" onClick={signOut}>
          Sign out
        </button>
      )}
    </div>
  )
}
