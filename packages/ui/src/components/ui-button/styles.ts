import { css } from 'lit'

export default css`
  :host {
    width: var(--local-width);
  }

  button {
    position: relative;
    width: 100%;
    column-gap: var(--ui-spacing-s);
    border-radius: var(--ui-border-radius-m);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-spacing-xs);
    padding: var(--ui-spacing-s) var(--ui-spacing-1xs) var(--ui-spacing-s) var(--local-left-padding);
  }

  button > ui-text {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button:disabled {
    opacity: 0.5;
  }

  button:hover:enabled {
    opacity: 0.8;
  }

  .button-default {
    background-color: var(--ui-color-surface-lo);
    color: var(--ui-color-foreground);
  }

  .button-primary {
    background-color: var(--ui-color-primary);
    color: var(--ui-color-white);
  }

  .button-secondary {
    background-color: var(--ui-color-soft);
    color: var(--ui-color-primary);
  }

  .button-tertiary {
    background-color: var(--ui-color-surface-hi);
    color: var(--ui-color-white);
  }

  .icon-box {
    position: absolute;
    width: var(--ui-box-size-xs);
    height: var(--ui-box-size-xs);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ui-color-white);
    border-radius: var(--ui-border-radius-2xl);
    right: var(--ui-spacing-1xs);
  }

  [data-loading='true'] {
    animation: spin 1s linear infinite;
  }

  .icon-default {
    color: var(--ui-color-black) !important;
  }

  .icon-primary {
    color: var(--ui-color-primary) !important;
  }

  .icon-tertiary {
    color: var(--ui-color-black) !important;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
