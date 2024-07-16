import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { appContext } from './state/app.machine.js';
import { AddPatientFields, fields } from './scan.types.js';

const formFields = fields.map(
  (name) => html`
    <label for=${name}>${name}</label>
    <input id=${name} name=${name} type="text" />
  `,
);

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
        <h2>Add Patient</h2>
        <form @submit=${this.handleSubmit}>
          ${formFields}
          <label for="file">Scan File</label>
          <input id="file" name="file" type="file" />
          <div>
            <sl-button type="submit">Add Patient</sl-button>
            <span hidden=${!this.patientAdded || nothing}>Patient Added!</span>
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
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    label {
      font-weight: bold;
    }
    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      width: fit-content;
    }
    button:hover {
      background-color: #0056b3;
    }

    span {
      margin-left: 1rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'patient-editor': ProcessingRoot;
  }
}
