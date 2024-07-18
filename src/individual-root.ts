import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { literal } from 'lit/static-html.js';

import './accordion-layout.js';
import './scan-table.js';
import './all-scans.js';

const SECTIONS = [
  { title: 'Patients', tag: literal`scan-table` },
  { title: 'Charts', tag: literal`biomarker-charts` },
  { title: 'Images', tag: literal`all-scans` },
];

@customElement('individual-root')
export class IndividualRoot extends LitElement {
  render() {
    return html` <accordion-layout .sections=${SECTIONS}></accordion-layout> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'individual-root': IndividualRoot;
  }
}
