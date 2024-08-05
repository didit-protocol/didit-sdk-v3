import { css } from 'lit'

export default css`
  :host {
    max-width: 200px;
    display: flex;
    align-items: center;
    gap: var(--ui-spacing-xs);
  }

  .avatar {
    overflow: hidden;
    border-radius: var(--ui-border-radius-2xl);
    min-width: fit-content;
  }

  .names {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .names ui-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
