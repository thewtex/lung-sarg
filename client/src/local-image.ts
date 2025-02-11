import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

import { readImage } from '@itk-wasm/image-io';
import { readImageDicomFileSeries } from '@itk-wasm/dicom';
import { ItkViewer2d } from '@itk-viewer/element/itk-viewer-2d.js';
import '@itk-viewer/element/itk-viewer-2d.js';
import { ItkWasmMultiscaleSpatialImage } from '@itk-viewer/io/ItkWasmMultiscaleSpatialImage.js';

/**
 * Filenames must be sanitized prior to being passed into itk-wasm.
 *
 * In particular, forward slashes cause FS errors in itk-wasm.
 * @param name
 * @returns
 */
function sanitizeFileName(name: string) {
  return name.replace(/\//g, '_');
}

/**
 * Returns a new File instance with a sanitized name.
 * @param file
 */
function sanitizeFile(file: File) {
  return new File([file], sanitizeFileName(file.name));
}

const makeImage = async (files: File[]) => {
  const cleanFiles = files.map(sanitizeFile);
  if (cleanFiles.length === 1) {
    const { image } = await readImage(cleanFiles[0]);
    return image;
  }
  const { outputImage } = await readImageDicomFileSeries({
    inputImages: cleanFiles,
    singleSortedSeries: false,
  });
  return outputImage;
};

@customElement('local-image')
export class LocalImage extends LitElement {
  selectFiles(event: Event) {
    const button = event.target as Element;
    (button.nextElementSibling as HTMLInputElement).click();
  }

  async filesPicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      const viewer = this.shadowRoot?.querySelector(
        'itk-viewer-2d',
      ) as ItkViewer2d;
      if (!viewer) {
        throw new Error('Viewer not found');
      }
      const itkImage = await makeImage(Array.from(files));
      const image = new ItkWasmMultiscaleSpatialImage(itkImage);
      const viewerActor = viewer.getActor();
      viewerActor?.send({ type: 'setImage', image });
    }
  }

  getFiles() {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    return input.files;
  }

  render() {
    return html`
      <div class="root">
        <itk-viewer-2d></itk-viewer-2d>
        <div class="overlay">
          <sl-button @click=${this.selectFiles}>Select Image Files</sl-button>
          <input @input=${this.filesPicked} type="file" multiple hidden />
        </div>
      </div>
    `;
  }

  static styles = css`
    .root {
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
    }

    .overlay {
      position: absolute;
      top: var(--sl-spacing-x-small);
      left: var(--sl-spacing-x-small);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'local-image': LocalImage;
  }
}
