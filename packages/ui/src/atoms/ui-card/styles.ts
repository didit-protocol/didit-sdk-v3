import { css } from 'lit'

export default css`
  :host {
    display: block;
    border-radius: clamp(0px, var(--ui-border-radius-l), 44px);
    background-color: var(--ui-color-modal-bg);
    overflow: hidden;
  }
`
