import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, snapshot } from 'valtio/vanilla'
import type { DiditSdkVersion, Metadata, ProjectId } from '../types/index.js'

// -- Types --------------------------------------------- //
export interface ConfigurationControllerState {
  projectId: ProjectId
  clientId: string
  clientSecret?: string
  claims?: `${string}:${string}`
  scope?: string
  metadata?: Metadata
  sdkVersion: DiditSdkVersion
}

type StateKey = keyof ConfigurationControllerState

// -- State --------------------------------------------- //
const state = proxy<ConfigurationControllerState>({
  projectId: '',
  clientId: '',
  sdkVersion: 'didit-sdk-js-undefined'
})

// -- Controller ---------------------------------------- //
export const ConfigurationController = {
  state,

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: ConfigurationControllerState[K]) => void
  ) {
    return subKey(state, key, callback)
  },

  setProjectId(projectId: ConfigurationControllerState['projectId']) {
    state.projectId = projectId
  },

  setClientId(clientId: ConfigurationControllerState['clientId']) {
    state.clientId = clientId
  },

  setClientSecret(clientSecret: ConfigurationControllerState['clientSecret']) {
    state.clientSecret = clientSecret
  },

  setClaims(claims: ConfigurationControllerState['claims']) {
    state.claims = claims
  },

  setScope(scope: ConfigurationControllerState['scope']) {
    state.scope = scope
  },

  setSdkVersion(sdkVersion: ConfigurationControllerState['sdkVersion']) {
    state.sdkVersion = sdkVersion
  },

  setMetadata(metadata: ConfigurationControllerState['metadata']) {
    state.metadata = metadata
  },

  getSnapshot() {
    return snapshot(state)
  }
}
