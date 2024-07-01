import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, subscribe as sub } from 'valtio/vanilla'
import { EventsController } from './Events.js'
import { RouterController } from './Router.js'
import { AccountController } from './Account.js'

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
      state.loading = true
    } else {
      RouterController.reset('Connect')
      state.loading = true
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
    state.loading = false
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
