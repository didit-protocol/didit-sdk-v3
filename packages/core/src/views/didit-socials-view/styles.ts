import { css } from 'lit'

export default css`
  :host > ui-flex {
    margin-bottom: var(--ui-spacing-l);
  }
  ui-button {
    flex-grow: 1;
    min-width: 150px;
  }

  [data-provider='apple'] {
    color: var(--ui-color-black);
  }
`
