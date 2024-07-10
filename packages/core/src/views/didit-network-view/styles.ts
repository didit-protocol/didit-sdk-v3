import { css } from 'lit'

export default css`
  .network-container {
    margin-top: var(--ui-spacing-xxl);
    border-radius: var(--ui-border-radius-xs);
    background-color: var(--ui-color-surface-ulo);
    overflow: hidden;
  }
  .network-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--ui-color-surface-md);
    padding: var(--ui-spacing-s);
    border-radius: var(--ui-border-radius-xxs);
  }

  .network-button:hover:enabled {
    background-color: var(--ui-color-background);
  }
`
