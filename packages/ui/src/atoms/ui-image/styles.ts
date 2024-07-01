import { css } from 'lit'

export default css`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: var(--local-border-radius);
    overflow: hidden;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
`
