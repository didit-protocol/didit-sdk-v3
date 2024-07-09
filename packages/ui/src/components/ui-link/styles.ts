import { css } from 'lit'

export default css`
  :host {
    width: fit-content;
    position: relative;
  }

  button {
    border: none;
    width: fit-content;
    white-space: nowrap;
    color: var(--ui-color-primary);
    gap: var(--ui-spacing-xs);
  }

  button:hover:enabled {
    opacity: 0.8;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
