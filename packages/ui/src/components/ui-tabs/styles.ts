import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    background-color: var(--ui-color-surface-lo);
    border-radius: var(--ui-border-radius-xs);
    padding: var(--ui-spacing-3xs);
    position: relative;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: var(--local-tab-height);
    border-radius: var(--ui-border-radius-xs);
    background-color: var(--ui-color-white);
    box-shadow: inset 0 0 0 1px var(--ui-color-surface-ulo);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--ui-ease-out-power-1) var(--ui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > ui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button {
    border-radius: var(--ui-border-radius-xs);
    padding: var(--ui-spacing-s);
  }

  button[data-active='true'] > ui-text {
    color: var(--ui-color-foreground);
  }

  button[data-active='false'] > ui-text {
    color: var(--ui-color-surface-mdlo);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button > ui-text {
    pointer-events: none;
    transition: color var(--ui-e ase-out-power-1) var(--ui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--ui-ease-out-power-1) var(--ui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 91px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: var(--ui-color-white);
    opacity: 0.8;
  }

  button:hover:enabled > ui-text,
  button:active:enabled > ui-text {
    color: var(--ui-color-foreground);
  }
`
