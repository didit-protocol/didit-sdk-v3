import { css } from 'lit'

export default css`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--ui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--ui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .ui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .ui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ui-font-title-1 {
    font-size: var(--ui-font-size-xl);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-2xl);
  }

  .ui-font-title-2 {
    font-size: var(--ui-font-size-large);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-xl);
  }

  .ui-font-title-3 {
    font-size: var(--ui-font-size-medium);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-large);
  }

  .ui-font-title-4 {
    font-size: var(--ui-font-size-paragraph);
    font-weight: var(--ui-font-weight-medium);
    letter-spacing: var(--ui-letter-spacing-medium);
  }

  .ui-font-paragraph-1 {
    font-size: var(--ui-font-size-paragraph);
    font-weight: var(--ui-font-weight-light);
    letter-spacing: var(--ui-letter-spacing-micro);
  }

  .ui-font-paragraph-2 {
    font-size: var(--ui-font-size-small);
    font-weight: var(--ui-font-weight-light);
    letter-spacing: var(--ui-letter-spacing-mini);
  }

  .ui-font-paragraph-3 {
    font-size: var(--ui-font-size-tiny);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-small);
  }

  .ui-font-styled-label {
    font-size: var(--ui-font-size-micro);
    font-weight: var(--ui-font-weight-medium);
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  .ui-font-label {
    font-size: var(--ui-font-size-smaller);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-paragraph);
  }

  .ui-font-button-1 {
    font-size: var(--ui-font-size-small);
    font-weight: var(--ui-font-weight-medium);
    letter-spacing: var(--ui-letter-spacing-mini);
  }

  .ui-font-button-2 {
    font-size: var(--ui-font-size-smaller);
    font-weight: var(--ui-font-weight-medium);
    letter-spacing: var(--ui-letter-spacing-mini);
  }

  .ui-font-link {
    font-size: var(--ui-font-size-small);
    font-weight: var(--ui-font-weight-regular);
    letter-spacing: var(--ui-letter-spacing-small);
  }

  .ui-font-tab-link {
    font-size: var(--ui-font-size-smaller);
    font-weight: var(--ui-font-weight-medium);
    letter-spacing: var(--ui-letter-spacing-paragraph);
  }
`
