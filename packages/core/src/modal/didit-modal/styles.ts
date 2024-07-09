import { css } from 'lit'

export default css`
  :host {
    z-index: var(--ui-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--ui-cover);
    transition: opacity 0.2s var(--ui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  ui-card {
    max-width: var(--ui-modal-width);
    width: 100%;
    padding: var(--ui-spacing-2xl);
    position: relative;
    animation-duration: 0.2s;
    animation-name: zoom-in;
    animation-fill-mode: backwards;
    animation-timing-function: var(--ui-ease-out-power-2);
    outline: none;
  }

  ui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    ui-flex {
      align-items: flex-start;
    }

    ui-card {
      margin: var(--ui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    ui-flex {
      align-items: flex-end;
    }

    ui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation-name: slide-in;
    }
  }
`
