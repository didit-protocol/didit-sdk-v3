import { css } from 'lit'

export default css`
  .qr-code-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: var(--ui-border-radius-xs);
    display: block;
    background: linear-gradient(
      120deg,
      var(--ui-color-surface-ulo) 5%,
      var(--ui-color-surface-ulo) 48%,
      var(--ui-color-soft) 55%,
      var(--ui-color-soft) 60%,
      var(--ui-color-soft) calc(60% + 10px),
      var(--ui-color-surface-ulo) calc(60% + 12px),
      var(--ui-color-surface-ulo) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  ui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
