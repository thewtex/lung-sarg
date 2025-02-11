import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './patient-editor.js';

@customElement('processing-root')
export class ProcessingRoot extends LitElement {
  render() {
    return html` <patient-editor></patient-editor>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'processing-root': ProcessingRoot;
  }
}
