import { css } from 'lit'

export default css`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ui-color-white);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--ui-border-radius-l), 40px);
    background-color: var(--ui-color-white);
    padding: var(--ui-spacing-l);
  }

  :host([data-clear='true']) > ui-icon {
    display: none;
  }

  svg:first-child,
  ui-image,
  ui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  ui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--ui-border-radius-xs);
  }

  ui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`
