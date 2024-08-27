import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

import './local-image.js';

@customElement('local-images')
export class LocalImages extends LitElement {
  nextFileId = 1;

  @state()
  files = [0];

  removeFile = (id: number) => () => {
    this.files = this.files.filter((fileId) => fileId !== id);
  };

  addFile = () => () => {
    this.files = [...this.files, this.nextFileId++];
  };

  selectFiles(event: Event) {
    const button = event.target as Element;
    (button.nextElementSibling as HTMLInputElement).click();
  }

  getFiles() {
    const images = this.shadowRoot?.querySelectorAll('local-image');
    if (!images) return [];
    return Array.from(images).map((element) => {
      return element.getFiles();
    });
  }

  render() {
    return html`
      <h2>Images</h2>
      <div class="images">
        ${repeat(
          this.files,
          (id) => id,
          (id) => html`
            <div class="file-input">
              <div>
                <sl-icon-button
                  @click="${this.removeFile(id)}"
                  name="x-lg"
                  label="Delete"
                  style="font-size: 2rem;"
                ></sl-icon-button>
              </div>
              <local-image class="fill"></local-image>
            </div>
          `,
        )}
      </div>
      <sl-icon-button
        @click="${this.addFile()}"
        name="plus-lg"
        label="Add"
        style="font-size: 2.5rem;"
      ></sl-icon-button>
    `;
  }

  static styles = css`
    .images {
      display: grid;
      gap: 1rem;
    }
    .file-input {
      display: flex;
    }
    .fill {
      flex: 1;
      height: 400px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'local-images': LocalImages;
  }
}
