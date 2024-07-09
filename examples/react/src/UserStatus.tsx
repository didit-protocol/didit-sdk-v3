import { useDiditState, useDiditSignOut } from '@didit-sdk/react'

export function UserStatus() {
  const signOut = useDiditSignOut()
  const { user, status, isAuthenticated, authMethod, selectedNetworkName } = useDiditState()

  return (
    <>
      <h3>didit state</h3>
      <h5>status: {status}</h5>
      <h5>isAuthenticated: {isAuthenticated ? 'yes' : 'no'}</h5>
      <h5>user address: {user?.identifier}</h5>
      <h5>authMethod: {authMethod}</h5>
      <h5>selectedNetworkName: {selectedNetworkName}</h5>
      {isAuthenticated && (
        <button type="button" id="modal-btn" onClick={signOut}>
          Sign out
        </button>
      )}
    </>
  )
}
