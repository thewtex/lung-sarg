import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { connectState } from './utils/select-state.js';
import './scan-view.js';
import { Feature, FEATURE_KEYS } from './scan.types.js';
import { compare } from './state/scan-selections.js';

@customElement('all-scans')
export class FeatureScans extends LitElement {
  @property() feature: Feature = FEATURE_KEYS[0];

  scans = connectState(
    this,
    (state) => state.context.scanSelectionsPool.selections,
    compare,
  );

  render() {
    const scan = this.scans.value?.[0];
    if (!scan) {
      return html``;
    }
    return html`
      <div class="scans">
        ${repeat(
          FEATURE_KEYS,
          (feature) => feature,
          (feature) => html`
            <div>
              <scan-view .scan=${scan} .feature=${feature}>
                <div class="feature-label">${feature.toUpperCase()}</div>
              </scan-view>
            </div>
          `,
        )}
      </div>
    `;
  }

  // aspect-ratio critical to keep the container from growing when expanding accordion section
  static styles = css`
    .scans {
      flex: 1;
      display: flex;
      flex-direction: row;
      height: 100%;
    }

    .scans > * {
      aspect-ratio: 1;
      margin: 0.2rem;
      flex: 1;
      position: relative;
    }

    scan-view {
      height: 100%;
    }

    .feature-label {
      text-align: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-scans': FeatureScans;
  }
}
