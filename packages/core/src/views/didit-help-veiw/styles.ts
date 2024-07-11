import { css } from 'lit'

export default css`
  :host {
  }

  .help-view {
    height: 339px;
  }

  .help-container {
    width: 100%;
    height: fit-content;
    z-index: 2;
  }
  .icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--ui-spacing-3xl);
    height: var(--ui-spacing-3xl);
    min-width: var(--ui-spacing-3xl);
    min-height: var(--ui-spacing-3xl);
    border-radius: var(--ui-border-radius-2xl);
    background-color: var(--ui-color-primary);
  }

  .help-background {
    position: absolute;
    bottom: -30%;
    left: -15%;
    width: 130%;
    height: 189px;
    z-index: 1;
  }

  .layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      181deg,
      rgba(var(--local-color-backgound), 0.00) -10.47%,
      var(--ui-color-background) 96.49%
    );
  }

  :host .tokens {
    width: 100% !important;
    height: 100% !important;
  }
`
