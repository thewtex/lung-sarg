import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

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
    return this.files.map((id) => {
      const input = this.shadowRoot?.querySelector(
        `[name="files-${id}"]`,
      ) as HTMLInputElement;
      return input.files;
    });
  }

  render() {
    return html`
      <h2>Images</h2>
      ${repeat(
        this.files,
        (id) => id,
        (id) => html`
                <div class="file-input">
                  <span>
                    <sl-button @click=${this.selectFiles}>Select Image Files</sl-button>
                    <input name="files-${id}" type="file" multiple hidden/></input>
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
    `;
  }

  static styles = css`
    .file-input {
      display: flex;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'local-images': LocalImages;
  }
}
