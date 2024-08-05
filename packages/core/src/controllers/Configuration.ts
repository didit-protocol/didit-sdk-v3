import { subscribeKey as subKey } from 'valtio/vanilla/utils'
import { proxy, snapshot } from 'valtio/vanilla'
import type { DiditAuthType, DiditSdkVersion, Metadata, ProjectId } from '../types/index.js'

// -- Types --------------------------------------------- //
export interface ConfigurationControllerState {
  projectId: ProjectId
  clientId: string
  clientSecret?: string
  claims?: `${string}:${string}`
  scope?: string
  providers: DiditAuthType[]
  metadata?: Metadata
  profileLink?: string
  sdkVersion: DiditSdkVersion
}

type StateKey = keyof ConfigurationControllerState

// -- State --------------------------------------------- //
const state = proxy<ConfigurationControllerState>({
  projectId: '',
  clientId: '',
  providers: ['apple', 'google', 'wallet'],
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

  setProfileLink(profileLink: ConfigurationControllerState['profileLink']) {
    state.profileLink = profileLink
  },

  setProviders(providers: ConfigurationControllerState['providers']) {
    state.providers = providers
  },

  getSnapshot() {
    return snapshot(state)
  }
}
