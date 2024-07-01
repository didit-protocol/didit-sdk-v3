import { css } from 'lit'

export default css`
  .didit-linking-container {
    position: relative;
    width: 100%;
    max-width: 197px;
    flex-grow: 1;
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

  .ui-didit-link-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ui-didit-link-loader {
    width: 150%;
    height: 150%;
  }

  .didit-logo {
    z-index: 1;
  }

  [data-error='true'] .ui-didit-link-loader {
    opacity: 0;
  }

  [data-error='true'] .didit-logo {
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
`
