import { customElement } from '@didit-sdk/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import styles from './styles.js'
import { RouterController, type RouterControllerState } from '../../controllers/Router.js'

@customElement('didit-router')
export class DiditRouter extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private resizeObserver?: ResizeObserver = undefined

  private prevHeight = '0px'

  private prevHistoryLength = 1

  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private view = RouterController.state.view

  public constructor() {
    super()
    this.unsubscribe.push(RouterController.subscribeKey('view', val => this.onViewChange(val)))
  }

  public override firstUpdated() {
    this.resizeObserver = new ResizeObserver(async ([content]) => {
      const height = `${content?.contentRect.height}px`
      if (this.prevHeight !== '0px') {
        await this.animate([{ height: this.prevHeight }, { height }], {
          duration: 150,
          easing: 'ease',
          fill: 'forwards'
        }).finished
        this.style.height = 'auto'
      }
      this.prevHeight = height
    })
    this.resizeObserver.observe(this.getWrapper())
  }

  public override disconnectedCallback() {
    this.resizeObserver?.unobserve(this.getWrapper())
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`<div>${this.viewTemplate()}</div>`
  }

  // -- Private ------------------------------------------- //
  private viewTemplate() {
    switch (this.view) {
      case 'Connect':
        return html`<didit-connect-view></didit-connect-view>`
      case 'Wallets':
        return html`<didit-wallets-view></didit-wallets-view>`
      case 'ConnectWallet':
        return html`<didit-connecting-wallet-view></didit-connecting-wallet-view>`
      case 'ConnectWalletConnect':
        return html`<didit-connecting-wc-view></didit-connecting-wc-view>`
      case 'ConnectSocial':
        return html`<didit-connecting-social-view></didit-connecting-social-view>`
      case 'ConnectingDiditSiwe':
        return html`<didit-connecting-siwe-view></didit-connecting-siwe-view>`
      case 'Profile':
        return html`<didit-profile-view></didit-profile-view>`
      case 'Networks':
        return html`<div>Networks</div>`
      case 'Help':
        return html`<div>Help</div>`
      default:
        return html`<div>Connect</div>`
    }
  }

  private async onViewChange(newView: RouterControllerState['view']) {
    const { history } = RouterController.state
    let xOut = -10
    let xIn = 10
    if (history.length < this.prevHistoryLength) {
      xOut = 10
      xIn = -10
    }

    this.prevHistoryLength = history.length
    await this.animate(
      [
        { opacity: 1, transform: 'translateX(0px)' },
        { opacity: 0, transform: `translateX(${xOut}px)` }
      ],
      { duration: 150, easing: 'ease', fill: 'forwards' }
    ).finished
    this.view = newView
    await this.animate(
      [
        { opacity: 0, transform: `translateX(${xIn}px)` },
        { opacity: 1, transform: 'translateX(0px)' }
      ],
      { duration: 150, easing: 'ease', fill: 'forwards', delay: 50 }
    ).finished
  }

  private getWrapper() {
    return this.shadowRoot?.querySelector('div') as HTMLElement
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'didit-router': DiditRouter
  }
}
