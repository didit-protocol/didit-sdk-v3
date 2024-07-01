import { css } from 'lit'

export default css`
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

  [data-error='true'] .connector-logo {
    animation: bounce 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] .retry-button {
    opacity: 0.5;
    pointer-events: none;
  }

  [data-retry='true'] .retry-button {
    opacity: 1;
    pointer-events: auto;
  }

  .buttons-container {
    width: 100%;
  }

  .open-link-button {
    grow: 1;
  }
`
