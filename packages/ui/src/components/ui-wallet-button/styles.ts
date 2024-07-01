import { css } from 'lit'

export default css`
  button {
    width: 100%;
    padding: var(--ui-spacing-s);
    background-color: var(--ui-color-surface-ulo);
    border-radius: var(--ui-border-radius-s);
    justify-content: space-between;
  }

  button:hover:enabled {
    background-color: var(--ui-color-surface-lo);
  }

  button:disabled {
    opacity: 0.5;
  }

  .left-side {
    width: fit-content;
  }
`
