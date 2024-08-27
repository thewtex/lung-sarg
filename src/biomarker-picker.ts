import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { ContextConsumer } from '@lit/context';
import { appContext, PlotParameter } from './state/app.machine.js';
import { fields, Scan } from './scan.types.js';
import { connectState } from './utils/select-state.js';
import { spacesToUnderscores, underscoresToSpaces } from './utils/shoelace.js';

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
      value: underscoresToSpaces(target.value) as keyof Scan,
    });
    e.stopPropagation();
  };

  render() {
    return html`
      <sl-select
        label=${this.parameter}
        .value=${spacesToUnderscores(this.biomarker.value)}
        @input=${this.setPlotParameter}
      >
        ${map(
          fields,
          (field) =>
            html`<sl-option value="${spacesToUnderscores(field)}">
              ${field}
            </sl-option>`,
        )}
      </sl-select>
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
