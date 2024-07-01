import { css } from 'lit'

export default css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--ui-spacing-m);
    padding: var(--ui-spacing-xs) !important;
    border-radius: var(--ui-border-radius-xxs);
  }

  :host > ui-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host > ui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    border: 1px solid var(--ui-color-primary);
    color: var(--ui-color-primary);
  }

  :host([data-variant='shade']) {
    border: 1px solid var(--ui-color-soft);
    color: var(--ui-color-soft);
  }

  :host([data-variant='success']) {
    border: 1px solid var(--ui-color-success);
    color: var(--ui-color-success);
  }

  :host([data-variant='error']) {
    border: 1px solid var(--ui-color-error);
    color: var(--ui-color-error);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > ui-text {
    transform: translateY(2%);
  }
`
