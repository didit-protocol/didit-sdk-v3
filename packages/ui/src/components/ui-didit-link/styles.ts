import { css } from 'lit'

export default css`
  :host {
    position: relative;
    width: 197px;
  }

  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: var(--local-loader-opacity);
  }

  .didit-logo {
    z-index: 1;
    animation: var(--local-didit-logo-animation);
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-15px);
    }
  }

  [data-bounce='true'] {
    animation: bounce 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-icon='apple'] {
    color: var(--ui-color-foreground);
  }
`
