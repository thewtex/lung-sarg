import { LitElement, html, css } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

import { Feature, FEATURES } from './scan.types.js';

@customElement('feature-bar')
export class FeatureBar extends LitElement {
  @property() feature!: Feature;

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
        <md-outlined-select
          label="Select Feature"
          .value=${FEATURES[this.feature].name}
          @input=${this.onFeatureInput}
          ${ref(this.featurePicker)}
        >
          ${map(
            Object.values(FEATURES),
            ({ name, long }) =>
              html`<md-select-option value="${name}">
                <div slot="headline">${name}</div>
                <div slot="supporting-text">${long}</div>
              </md-select-option>`,
          )}
        </md-outlined-select>
      </div>
      <md-icon-button @click="${this.clickHandler}" style="padding: 1rem">
        <md-icon>close</md-icon>
      </md-icon-button>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      --md-outlined-autocomplete-text-field-container-height: 36px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-bar': FeatureBar;
  }
}
