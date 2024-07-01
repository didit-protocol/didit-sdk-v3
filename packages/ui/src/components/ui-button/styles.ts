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
    padding: var(--ui-spacing-s) var(--local-left-padding, var(--ui-spacing-1xs))
      var(--ui-spacing-s) var(--ui-spacing-1xs);
  }

  button > ui-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
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
    color: var(--ui-color-background);
  }

  .button-secondary {
    background-color: var(--ui-color-soft);
    color: var(--ui-color-primary);
  }

  .button-tertiary {
    background-color: var(--ui-color-surface-hi);
    color: var(--ui-color-background);
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

  ui-icon {
    color: var(--ui-color-foreground) !important;
  }

  .icon-primary {
    color: var(--ui-color-primary) !important;
  }
`
