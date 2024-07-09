import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy } from 'valtio/vanilla'
import type { Connector, RouterView, WcWallet, Web3Network } from '../types/index.js'

// -- Types --------------------------------------------- //
export interface RouterControllerState {
  view: RouterView
  history: RouterControllerState['view'][]
  data?: {
    connector?: Connector
    wallet?: WcWallet
    network?: Web3Network
  }
}

// -- State --------------------------------------------- //
const state = proxy<RouterControllerState>({
  view: 'Connect',
  history: ['Connect']
})

type StateKey = keyof RouterControllerState

// -- Controller ---------------------------------------- //
export const RouterController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: RouterControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  push(view: RouterControllerState['view'], data?: RouterControllerState['data']) {
    if (view !== state.view) {
      state.view = view
      state.history.push(view)
      state.data = data
    }
  },

  reset(view: RouterControllerState['view']) {
    state.view = view
    state.history = [view]
  },

  replace(view: RouterControllerState['view'], data?: RouterControllerState['data']) {
    if (state.history.length >= 1 && state.history.at(-1) !== view) {
      state.view = view
      state.history[state.history.length - 1] = view
      state.data = data
    }
  },

  goBack() {
    if (state.history.length > 1) {
      state.history.pop()
      const [last] = state.history.slice(-1)
      if (last) {
        state.view = last
      }
    }
  },

  goBackToIndex(historyIndex: number) {
    if (state.history.length > 1) {
      state.history = state.history.slice(0, historyIndex + 1)
      const [last] = state.history.slice(-1)
      if (last) {
        state.view = last
      }
    }
  }
}
