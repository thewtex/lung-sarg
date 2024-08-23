import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ContextConsumer } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';

import { appContext } from './state/app.machine.js';
import { AddPatientFields, scanFieldInputTypes } from './scan.types.js';
import { spacesToUnderscores } from './utils/shoelace.js';

@customElement('patient-editor')
export class ProcessingRoot extends LitElement {
  stateService = new ContextConsumer(this, appContext, undefined, true);

  @state()
  patientAdded = false;

  nextFileId = 1;

  @state()
  files = [0];

  formFields: TemplateResult[] = [];

  constructor() {
    super();
    this.formFields = scanFieldInputTypes.map((field) => {
      const { type, name } = field;
      if (type === 'checkbox') {
        return html`
          <div>
            <div>${name}</div>
            <sl-checkbox name=${name}></sl-checkbox>
          </div>
        `;
      }
      if (type === 'select') {
        const { default: firstValue, options } = field;
        return html`
          <sl-select
            name=${name}
            label=${name}
            value=${spacesToUnderscores(firstValue)}
          >
            ${options.map(
              (option) => html`
                <sl-option value=${spacesToUnderscores(option)}>
                  ${option}
                </sl-option>
              `,
            )}
          </sl-select>
        `;
      }
      if (type === 'number' || type === 'text') {
        return html`
          <sl-input
            name=${name}
            type=${type}
            value=${field.default}
            label=${name}
          ></sl-input>
        `;
      }
      return html`
        <sl-input name=${name} type=${type} label=${name}></sl-input>
      `;
    });
  }

  removeFile = (id: number) => () => {
    this.files = this.files.filter((fileId) => fileId !== id);
  };

  addFile = () => () => {
    this.files = [...this.files, this.nextFileId++];
  };

  handleSubmit(event: Event) {
    event.preventDefault();
    const fields = serialize(
      event.target as HTMLFormElement,
    ) as unknown as AddPatientFields;
    this.stateService.value?.service.send({ type: 'PATIENT_ADD', fields });
    this.patientAdded = true;
  }

  render() {
    return html`
      <div class="container">
        <h2 style="text-align: center">Add Patient</h2>
        <form @submit=${this.handleSubmit}>
          ${this.formFields}
          <!-- files -->
          <div class="form-footer">
            <h2><label for="files">Scan Files</label></h2>
            ${repeat(
              this.files,
              (id) => id,
              (id) => html`
                <div class="file-input">
                  <span>
                    <sl-input name="files" type="file" /></sl-input>
                  </span>
                  <sl-icon-button
                    @click="${this.removeFile(id)}"
                    name="x-lg"
                    label="Delete"
                    style="font-size: 2rem; padding-left: .5rem"
                  ></sl-icon-button>
                </div>
              `,
            )}
            <sl-icon-button
              @click="${this.addFile()}"
              name="plus-lg"
              label="Add"
              style="font-size: 2rem;"
            ></sl-icon-button>
          </div>
          <!-- submit -->
          <div class="form-footer" style="padding-top: 1rem">
            <sl-button type="submit" variant="primary">Add Patient</sl-button>
            <span .hidden=${!this.patientAdded} class="submit-message"
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

    .form-footer {
      grid-column: span 2;
    }

    @media (min-width: 1400px) {
      form {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

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

    .file-input {
      display: flex;
      align-items: center;
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
