import { LitElement, html, css } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

import { Feature, FEATURES } from './scan.types.js';

@customElement('feature-bar')
export class FeatureBar extends LitElement {
  @property() feature: Feature;

  constructor() {
    super();
    this.feature = Object.keys(FEATURES)[0] as Feature;
  }

  clickHandler() {
    const event = new Event('feature-close', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  onFeatureInput(e: CustomEvent) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('featureSelected', {
        detail: target.value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  featurePicker = createRef();

  render() {
    return html`
      <div>
        <sl-select
          .value=${FEATURES[this.feature].name}
          @input=${this.onFeatureInput}
          ${ref(this.featurePicker)}
        >
          ${map(
            Object.values(FEATURES),
            ({ name }) =>
              html`<sl-option value="${name}"> ${name} </sl-option>`,
          )}
        </sl-select>
      </div>
      <sl-icon-button
        @click="${this.clickHandler}"
        name="x-lg"
        label="Close"
        style="font-size: 2rem; padding-left: .5rem"
      ></sl-icon-button>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-bar': FeatureBar;
  }
}
