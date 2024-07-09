export type SocialConnectorType = 'google' | 'apple'

export interface SocialConnector {
  id: string
  type: SocialConnectorType
  name: string
  imageUrl: string
  provider: SocialConnectorType
}
