import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, subscribe as sub } from 'valtio/vanilla'
/*
 * Import { AccountController } from './AccountController.js'
 * import { ApiController } from './ApiController.js'
 * import { PublicStateController } from './PublicStateController.js'
 * import type { RouterControllerState } from './RouterController.js'
 * import { RouterController } from './RouterController.js'
 */
import { EventsController } from './Events.js'
import { RouterController } from './Router.js'
import { AccountController } from './Account.js'
// Import { RouterController } from './Router.js'

// -- Types --------------------------------------------- //
export interface ModalControllerState {
  loading: boolean
  open: boolean
}

type StateKey = keyof ModalControllerState

// -- State --------------------------------------------- //
const state = proxy<ModalControllerState>({
  loading: false,
  open: false
})

// -- Controller ---------------------------------------- //
export const ModalController = {
  state,

  subscribe(callback: (newState: ModalControllerState) => void) {
    return sub(state, () => callback(state))
  },

  subscribeKey<K extends StateKey>(key: K, callback: (value: ModalControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  open() {
    const { isAuthenticated, isWalletConnected } = AccountController.state
    if (isAuthenticated) {
      RouterController.reset('Profile')
    } else if (isWalletConnected) {
      RouterController.reset('ConnectingDiditSiwe')
    } else {
      RouterController.reset('Connect')
    }
    state.open = true
    EventsController.sendEvent({
      type: 'track',
      event: 'MODAL_OPEN',
      properties: { authenticated: isAuthenticated }
    })
  },

  close() {
    const { isAuthenticated } = AccountController.state
    state.open = false
    EventsController.sendEvent({
      type: 'track',
      event: 'MODAL_CLOSE',
      properties: { authenticated: isAuthenticated }
    })
  },

  setLoading(loading: ModalControllerState['loading']) {
    state.loading = loading
  }
}
