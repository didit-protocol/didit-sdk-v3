import { css } from 'lit'

export default css`
  .account-button {
    border: none;
    width: 100%;
    column-gap: var(--ui-spacing-s);
    border-radius: var(--ui-border-radius-m);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ui-spacing-xs);
    padding: var(--ui-spacing-xs) var(--ui-spacing-l) var(--ui-spacing-xs) var(--ui-spacing-xs);
    background-color: var(--ui-color-background);
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    cursor: pointer;
  }

  .account-button:hover:enabled {
    opacity: 0.8;
  }
  .account-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
