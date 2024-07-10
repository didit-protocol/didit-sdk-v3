import { css } from 'lit'

export default css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
    background-color: var(--ui-color-surface-lo);
    overflow: hidden;
  }

  :host > ui-flex {
    width: var(--local-size);
    height: var(--local-size);
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
    padding: var(--local-padding);
  }

  .wallet-icon {
    width: 100% !important;
    height: 100% !important;
    align-items: center;
  }

  .wallet-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
