import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { ContextConsumer } from '@lit/context';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';

import { appContext } from './state/app.machine.js';
import { Scan, scanFieldInputTypes } from './scan.types.js';
import { spacesToUnderscores } from './utils/shoelace.js';
import './local-images.js';
import { LocalImages } from './local-images.js';
import { sendStudy } from './study-api.js';

const validateId = (id: string) => {
  //if id has numbers, then return true
  if (/\d/.test(id)) {
    return true;
  }
  const words = id.split(' ').filter(Boolean);
  if (
    words.length >= 1 &&
    words.every(
      (word) =>
        word[0] === word[0].toUpperCase() &&
        // probably not name if second character is uppercase
        (word.length < 2 || word[1] !== word[1].toUpperCase()),
    )
  ) {
    return false; // ID is likely a human name
  }
  return true;
};

const handleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;

  if (!validateId(value)) {
    inputElement.setCustomValidity('ID can not be a patients name.');
  } else {
    inputElement.setCustomValidity('');
  }

  inputElement.reportValidity();
};

@customElement('patient-editor')
export class ProcessingRoot extends LitElement {
  stateService = new ContextConsumer(this, appContext, undefined, true);

  @state()
  patientAdded = false;

  formFields: TemplateResult[] = [];
  images = createRef<LocalImages>();

  constructor() {
    super();
    this.formFields = scanFieldInputTypes.map((field) => {
      const { type, name } = field;
      if (name === 'Patient ID') {
        const date = new Date().toISOString().split('T')[0];
        const caseId = `${date}-${Math.floor(Math.random() * 1000)}`;
        return html`<sl-input
          name=${name}
          type=${type}
          value=${caseId}
          label=${name}
          @input=${handleInput}
        ></sl-input>`;
      }
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
            value=${field?.default}
            label=${name}
          ></sl-input>
        `;
      }
      return html`
        <sl-input name=${name} type=${type} label=${name}></sl-input>
      `;
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const fields = serialize(
      event.target as HTMLFormElement,
    ) as unknown as Scan;
    const files = this.images.value!.getFiles();
    sendStudy(fields, files);
    this.stateService.value?.service.send({ type: 'PATIENT_ADD', fields });
    this.patientAdded = true;
  }

  render() {
    return html`
      <div class="container">
        <h2 style="text-align: center">Add Study Data for Patient</h2>
        <form @submit=${this.handleSubmit}>
          ${this.formFields}
          <div class="form-footer">
            <local-images ${ref(this.images)}></local-images>
          </div>
          <!-- submit -->
          <div class="form-footer" style="padding-top: 1rem">
            <sl-button type="submit" variant="primary">
              Add Study Data for Patient
            </sl-button>
            <span .hidden=${!this.patientAdded} class="submit-message">
              Study Added!
            </span>
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
