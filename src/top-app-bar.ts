import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('top-app-bar')
export class TopAppBar extends LitElement {
  @property() title: string = 'title';
  @property() isMenuOpen: boolean = true;
  render() {
    return html`
      <div>
        <sl-icon-button
          @click="${this._clickHandler}"
          name="add"
          label="add"
          style="font-size: 2.5rem;"
        ></sl-icon-button>
      </div>
      <h1>${this.title}</h1>
    `;
  }
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }

    h1 {
      font-weight: 400;
      font-size: 22px;
      line-height: 28px;
    }
  `;

  private _clickHandler() {
    this.dispatchEvent(
      new CustomEvent('toggleMenu', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}
