import { css } from 'lit'

export default css`
  :host > ui-flex {
    max-height: clamp(360px, 540px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  :host > ui-flex::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .title {
    margin-top: var(--ui-spacing-xs);
    margin-bottom: var(--ui-spacing-3xl);
  }
`
