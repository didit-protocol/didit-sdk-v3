import { css } from 'lit'

export default css`
  button {
    border-radius: var(--local-border-radius);
    color: var(--ui-color-surface-md);
    padding: var(--local-padding);
    background-color: var(--ui-color-surface-ulo);
  }

  button:hover:enabled > ui-icon {
    color: var(--ui-color-foreground) !important;
  }

  @media (max-width: 700px) {
    button {
      padding: var(--ui-spacing-s);
    }
  }

  button > ui-icon {
    pointer-events: none;
  }

  button:disabled > ui-icon {
    color: var(--ui-color-surface-mdlo) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`
