import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextConsumer } from '@lit/context';
import '@revolist/revogrid';

import { appContext } from './state/app.machine.js';
import { fields, ScanId } from './scan.types.js';
import { compare, get, has } from './state/scan-selections.js';
import { connectState } from './utils/select-state.js';

const DATA_FILE = 'NSCLCR01Radiogenomic_DATA_LABELS_2018-05-22_1500-FD.csv';

@customElement('scan-table')
export class ScanTable extends LitElement {
  private tableData: Record<string, string>[] = [];
  private grid!: HTMLElement; // Use HTMLElement instead

  public stateService = new ContextConsumer(this, appContext, undefined, true);

  scanSelection = connectState(
    this,
    (state) => state.context.scanSelectionsPool.selections,
    compare,
  );

  scanFocus = connectState(this, (state) => {
    return state.context.focusScan;
  });

  connectedCallback() {
    super.connectedCallback();
    this.loadRows(DATA_FILE);
  }

  firstUpdated() {
    this.grid = this.renderRoot.querySelector('revo-grid') as HTMLElement;
    this.setupGridEvents();
  }

  setupGridEvents() {
    if (!this.grid) return;

    this.grid.addEventListener('afteredit', (_: any) => {
      // Handle edit events if needed
    });

    this.grid.addEventListener('beforecellfocus', (_: any) => {
      // Handle focus events if needed
    });

    this.grid.addEventListener('rowclick', (e: any) => {
      const id = e.detail.data['Patient ID'];
      if (id && this.stateService.value) {
        this.stateService.value?.service.send({ type: 'SCAN_CLICKED', id });
      }
    });
  }

  loadRows(path: string) {
    fetch(path)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split('\n');
        const table: Record<string, string>[] = [];
        const headers = rows[0].split(',');
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].split(',');
          const obj: Record<string, string> = {};
          for (let j = 0; j < row.length; j++) {
            obj[headers[j]] = row[j];
          }
          table.push(obj);
        }

        // add new patients
        const snapshot = this.stateService.value!.service.getSnapshot();
        const addedScans = snapshot.context.scans;
        addedScans.forEach((scan) => {
          const obj = Object.fromEntries(
            Object.entries(scan).map(([k, v]) => [k, v.toString()]),
          );
          table.push(obj);
        });

        this.tableData = table;
        this.requestUpdate();
      });
  }

  getRowNumber(id: ScanId) {
    return this.tableData.findIndex((row) => row['Patient ID'] === id);
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    const focus = this.scanFocus.value?.id;
    if (focus && this.grid) {
      const rowIndex = this.getRowNumber(focus);
      if (rowIndex >= 0) {
        // Scroll to the focused row
        (this.grid as any).scrollToRow(rowIndex);
      }
    }
  }

  render() {
    const columns = fields.map((field) => ({
      prop: field,
      name: field,
      cellTemplate: (createElement: any, props: any) => {
        const id = props.model['Patient ID'];
        const color = this.scanSelection.value
          ? get(id, this.scanSelection.value)?.color
          : null;

        const style = color ? `background-color: ${color};` : '';
        return createElement(
          'div',
          {
            style,
            class: { 'grid-cell': true },
          },
          props.model[field] || '',
        );
      },
    }));

    // Add a "selected" column at the beginning
    columns.unshift({
      prop: 'Patient ID',
      name: 'Patient ID',
      cellTemplate: (createElement: any, props: any) => {
        const id = props.model['Patient ID'];
        const isSelected = this.scanSelection.value
          ? has(id, this.scanSelection.value)
          : false;
        const color = isSelected
          ? get(id, this.scanSelection.value)?.color
          : null;

        const style = color ? `background-color: ${color};` : '';
        return createElement(
          'div',
          {
            style,
            class: { 'checkbox-cell': true },
          },
          isSelected ? '✓' : '☐',
        );
      },
    });

    return html`
      <revo-grid
        .source=${this.tableData}
        .columns=${columns}
        theme="material"
        .rowDefinitions=${this.getRowDefinitions()}
        resize="true"
        rowHeaders="true"
      ></revo-grid>
    `;
  }

  getRowDefinitions() {
    return this.tableData.map((row) => {
      const id = row['Patient ID'];
      const isSelected = this.scanSelection.value
        ? has(id, this.scanSelection.value)
        : false;
      const color = isSelected
        ? get(id, this.scanSelection.value)?.color
        : null;

      return {
        type: 'row',
        style: color ? `background-color: ${color}20;` : '', // 20 is for transparency
      };
    });
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    revo-grid {
      height: 100%;
      width: 100%;
    }

    .checkbox-cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .grid-cell {
      padding: 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'scan-table': ScanTable;
  }
}
