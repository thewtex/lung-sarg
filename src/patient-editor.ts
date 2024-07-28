import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import { appContext } from './state/app.machine.js';
import { AddPatientFields, scanFieldInputTypes } from './scan.types.js';

const formFields = Object.entries(scanFieldInputTypes).map(([name, type]) => {
  return html`
    <sl-input name=${name} type="${type}" label=${name}></sl-input>
  `;
});

@customElement('patient-editor')
export class ProcessingRoot extends LitElement {
  stateService = new ContextConsumer(this, appContext, undefined, true);

  @state()
  patientAdded = false;

  handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fields = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, v.toString()]),
    ) as unknown as AddPatientFields;
    this.stateService.value?.service.send({ type: 'PATIENT_ADD', fields });
    this.patientAdded = true;
  }

  render() {
    return html`
      <div class="container">
        <h2 style="text-align: center">Add Patient</h2>
        <form @submit=${this.handleSubmit}>
          ${formFields}
          <div class="file-input">
            <label for="file">Scan File</label>
            <input id="file" name="file" type="file" />
          </div>
          <div class="form-footer">
            <sl-button type="submit">Add Patient</sl-button>
            <span hidden=${!this.patientAdded || nothing} class="submit-message"
              >Patient Added!</span
            >
          </div>
        </form>
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 1rem;
    }

    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding: 1rem;
    }

    .file-input {
      grid-column: span 2;
    }

    .form-footer {
      grid-column: span 2;
    }

    @media (min-width: 1400px) {
      form {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      .file-input,
      .form-footer {
        grid-column: span 4;
      }
    }

    label {
      font-weight: bold;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .submit-message {
      padding-left: 1rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'patient-editor': ProcessingRoot;
  }
}
