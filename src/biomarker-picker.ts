import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

import { ContextConsumer } from '@lit/context';
import { appContext, PlotParameter } from './state/app.machine.js';
import { fields, Scan } from './scan.types.js';
import { connectState } from './utils/select-state.js';

@customElement('biomarker-picker')
export class BiomarkerPicker extends LitElement {
  @property() parameter!: PlotParameter;

  biomarker = connectState(
    this,
    (state) => state.context.plotParameters[this.parameter],
  );

  stateService = new ContextConsumer(this, appContext, undefined, true);

  private setPlotParameter = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    this.stateService.value?.service.send({
      type: 'PLOT_PARAMETER_CHANGED',
      parameter: this.parameter,
      value: target.value as keyof Scan,
    });
    e.stopPropagation();
  };

  render() {
    return html`
      <md-outlined-select
        label=${this.parameter}
        .value=${this.biomarker.value}
        @input=${this.setPlotParameter}
      >
        ${map(
          fields,
          (field) =>
            html`<md-select-option value="${field}">
              <div slot="headline">${field}</div>
            </md-select-option>`,
        )}
      </md-outlined-select>
    `;
  }

  static styles = css`
    :host {
      display: grid;
      margin: 0.4rem;

      position: relative;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'biomarker-picker': BiomarkerPicker;
  }
}
