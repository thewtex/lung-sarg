import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Routes } from '@lit-labs/router';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { isOnPath, PAGES, Page } from './pages.js';
import { ContextConsumer } from '@lit/context';
import { appContext } from './state/app.machine.js';

const pagesToIcons: Record<Page, string> = {
  population: 'people',
  individual: 'person',
  processing: 'person-add',
};

/**
 * List of page links
 *
 */
@customElement('nav-menu')
export class NavMenu extends LitElement {
  @property() opened = true;
  @property() routes!: Routes;
  @property() location = ''; // trigger rerender on route change

  public stateService = new ContextConsumer(this, appContext, undefined, true);

  handleClick(page: Page) {
    this.stateService.value?.service.send({ type: 'NAVIGATE', page });
  }

  render() {
    return html`
      <div class="nav-items">
        ${Object.entries(PAGES)
          .map(([page, values]) => ({
            icon: pagesToIcons[page as Page],
            page: page as Page,
            ...values,
          }))
          .map(({ icon, path, title, page }) => {
            return html`
              <a
                href=${this.routes.link(path)}
                @click=${() => this.handleClick(page)}
              >
                <sl-icon-button
                  name=${icon}
                  label=${title}
                  class="${isOnPath(path) ? 'selected' : ''}"
                  size="large"
                  variant="primary"
                  circle
                  style="font-size: 2.5rem;"
                ></sl-icon-button>
                <div style="padding-top: .5rem">${title}</div>
              </a>
            `;
          })}
      </div>
    `;
  }

  static styles = css`
    :host {
      background-color: var(--text-primary);
    }

    .nav-items {
      width: 120px;
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    a {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
      color: var(--text-white);
    }

    sl-icon-button::part(base) {
      color: var(--primary-color-light);
      background-color: white;
    }
    sl-icon-button::part(base):hover {
      color: var(--primary-color);
    }
    sl-icon-button.selected::part(base) {
      color: white;
      background-color: var(--primary-color);
    }
    sl-icon-button.selected::part(base):hover {
      color: lightgray;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-menu': NavMenu;
  }
}
