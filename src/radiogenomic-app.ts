import { ContextProvider } from '@lit/context';
import { html } from 'lit/static-html.js';
import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
// @ts-ignore: Property 'UrlPattern' does not exist
if (!globalThis.URLPattern) {
  import('urlpattern-polyfill');
}
import '@shoelace-style/shoelace/dist/themes/light.css';

import { createService, appContext, saveState } from './state/app.machine.js';

import './top-app-bar.js';
import './nav-menu.js';
import './population-root.js';
import './individual-root.js';
import './processing-root.js';
import { PAGES } from './pages.js';

const APP_TITLE = 'Radiogenomic' as const;

@customElement('radiogenomic-app')
export class RadiogenomicApp extends LitElement {
  // @ts-ignore
  private provider = new ContextProvider(this, appContext, {
    service: createService(),
  });

  private routes = new Router(
    this,
    Object.values(PAGES).map(({ path, tag }) => {
      return {
        path,
        render: () => {
          return html`<${tag}></${tag}>`;
        },
        enter: () => {
          saveState(this.provider.value.service.getSnapshot());
          return true;
        },
      };
    }),
  );

  @property() isMenuOpen = true;

  private _toggleMenuHandler() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  render() {
    return html`
      <nav-menu
        .opened=${this.isMenuOpen}
        .routes=${this.routes}
        .location=${window.location.pathname}
      ></nav-menu>
      <div class="center">
        <top-app-bar
          title=${APP_TITLE}
          .isMenuOpen=${this.isMenuOpen}
          @toggleMenu="${this._toggleMenuHandler}"
        ></top-app-bar>
        <div class="main-content">${this.routes.outlet()}</div>
      </div>
    `;
  }

  static styles = css`
    :host {
      height: 100%;
      width: 100%;

      display: flex;
    }

    .center {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }

    .main-content {
      flex: 1;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'radiogenomic-app': RadiogenomicApp;
  }
}
