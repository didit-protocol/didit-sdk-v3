import type { UiCard } from '../atoms/ui-card/index.js'
import type { UiIcon } from '../atoms/ui-icon/index.js'
import type { UiImage } from '../atoms/ui-image/index.js'
import type { UiText } from '../atoms/ui-text/index.js'
import type { UiDiditLinkLoader } from '../atoms/ui-didit-link-loader/index.js'

import type { UiButton } from '../components/ui-button/index.js'
import type { UiQrCode } from '../components/ui-qr-code/index.js'
import type { UiIconLink } from '../components/ui-icon-link/index.js'
import type { UiWalletButton } from '../components/ui-wallet-button/index.js'
import type { UiWalletImage } from '../components/ui-wallet-image/index.js'
import type { UiTag } from '../components/ui-tag/index.js'
import type { UiLink } from '../components/ui-link/index.js'
import type { UiTabs } from '../components/ui-tabs/index.js'
import type { UiDiditLink } from '../components/ui-didit-link/index.js'

import type { UiFlex } from '../layout/ui-flex/index.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomElement<E> = Partial<E & { children?: any; onClick: any }>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // -- atoms ------------------------------------------- //
      'ui-card': CustomElement<UiCard>
      'ui-icon': CustomElement<UiIcon>
      'ui-image': CustomElement<UiImage>
      'ui-text': CustomElement<UiText>
      'ui-didit-link-loader': CustomElement<UiDiditLinkLoader>

      // -- components ------------------------------------------- //
      'ui-button': CustomElement<UiButton>
      'ui-qr-code': CustomElement<UiQrCode>
      'ui-icon-link': CustomElement<UiIconLink>
      'ui-wallet-button': CustomElement<UiWalletButton>
      'ui-wallet-image': CustomElement<UiWalletImage>
      'ui-tag': CustomElement<UiTag>
      'ui-link': CustomElement<UiLink>
      'ui-tabs': CustomElement<UiTabs>
      'ui-didit-link': CustomElement<UiDiditLink>

      // -- Layout ------------------------------------------- //
      'ui-flex': CustomElement<UiFlex>
    }
  }
}
