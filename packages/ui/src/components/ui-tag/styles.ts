import { css } from 'lit'

export default css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--ui-spacing-m);
    padding: var(--ui-spacing-1xs) !important;
    border-radius: var(--ui-border-radius-3xs);
    background-color: var(--ui-color-surface-lo);
  }

  :host > ui-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([data-variant='default']) {
    background-color: var(--ui-color-surface-lo);
    color: var(--ui-color-surface-md);
  }

  :host([data-variant='primary']) {
    background-color: var(--ui-color-soft);
    color: var(--ui-color-primary);
  }

  :host([data-variant='secondary']) {
    background-color: #ecf677;
    color: var(--ui-color-black);
  }

  :host([data-variant='success']) {
    background-color: rgba(65, 217, 127, 0.15);
    color: var(--ui-color-success);
  }

  :host([data-variant='error']) {
    background-color: rgba(255, 65, 65, 0.15);
    color: var(--ui-color-error);
  }
`
