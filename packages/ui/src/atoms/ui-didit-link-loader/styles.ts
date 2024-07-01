import { css } from 'lit'

export default css`
  :host {
    width: inherit;
    height: inherit;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`
