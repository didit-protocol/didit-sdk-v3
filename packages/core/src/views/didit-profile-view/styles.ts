import { css } from 'lit'

export default css`
  ui-flex {
    width: 100%;
  }

  :host > ui-flex:first-child {
    transform: translateY(calc(var(--ui-spacing-xxs) * -1));
  }

  ui-icon-link {
    margin-right: calc(var(--ui-icon-box-size-md) * -1);
  }

  ui-notice-card {
    margin-bottom: var(--ui-spacing-3xs);
  }

  didit-transactions-view {
    max-height: 200px;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ui-spacing-s);
    height: 48px;
    padding: var(--ui-spacing-xs);
    padding-right: var(--ui-spacing-s);
    box-shadow: inset 0 0 0 1px var(--ui-color-gray-glass-002);
    background-color: var(--ui-color-gray-glass-002);
    border-radius: 24px;
    transaction: background-color 0.2s linear;
  }

  .account-button:hover {
    background-color: var(--ui-color-gray-glass-005);
  }

  .avatar-container {
    position: relative;
  }

  ui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--ui-color-gray-glass-005);
  }

  ui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px var(--ui-color-gray-glass-005);
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links ui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition: background-color var(--ui-ease-out-power-1) var(--ui-duration-md);
    will-change: background-color;
  }

  .account-links ui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links ui-flex ui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links ui-flex ui-icon svg path {
    stroke: #667dff;
  }
`
