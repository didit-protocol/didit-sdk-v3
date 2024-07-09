import { css } from 'lit'

export default css`
  :host {
    display: block;
    position: fixed;
    opacity: 0;
    pointer-events: none;
    top: 2%;
    left: 50%;
    width: max-content;
    border: white;
    z-index: var(--ui-z-index);
  }

  :host > div {
    max-width: 328px;
    height: max-content;
    display: flex;
    align-items: stretch;
    gap: var(--ui-spacing-s);
    border-radius: var(--ui-border-radius-xs);
    padding: var(--ui-spacing-s) var(--ui-spacing-2l);
    background-color: var(--ui-color-background);
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }

  ui-text {
    word-break: break-word;
  }

  .toast-bar {
    width: var(--ui-spacing-xxs);
    min-width: var(--ui-spacing-xxs);
    border-radius: var(--ui-border-radius-xs);
  }

  [data-variant='info'] > .toast-bar {
    background-color: var(--ui-color-surface-md);
    color: var(--ui-color-surface-md);
  }

  [data-variant='warning'] > .toast-bar {
    background-color: #ffc757;
    color: #ffc757;
  }

  [data-variant='success'] > .toast-bar {
    background-color: var(--ui-color-success);
    color: var(--ui-color-success);
  }

  [data-variant='error'] > .toast-bar {
    background-color: var(--ui-color-error);
    color: var(--ui-color-error);
  }
`
