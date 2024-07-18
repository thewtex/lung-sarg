import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ContextConsumer } from '@lit/context';
import '@material/web/button/elevated-button.js';

import { ZarrMultiscaleSpatialImage } from '@itk-viewer/io/ZarrMultiscaleSpatialImage.js';
import { ItkViewer2d } from '@itk-viewer/element/itk-viewer-2d.js';
import '@itk-viewer/element/itk-viewer-2d.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';

import { Feature } from './scan.types.js';
import { ScanSelection } from './state/scan-selections.js';
import { appContext } from './state/app.machine.js';

const featureToImage = {
  ct: 'https://dandiarchive.s3.amazonaws.com/zarr/7723d02f-1f71-4553-a7b0-47bda1ae8b42',
  pet: 'https://dandiarchive.s3.amazonaws.com/zarr/7723d02f-1f71-4553-a7b0-47bda1ae8b42',
  mri: 'https://dandiarchive.s3.amazonaws.com/zarr/7723d02f-1f71-4553-a7b0-47bda1ae8b42',
  dx: 'https://dandiarchive.s3.amazonaws.com/zarr/7723d02f-1f71-4553-a7b0-47bda1ae8b42',
} as const;

const getImage = (feature: Feature) => {
  return featureToImage[feature];
};

@customElement('scan-view')
export class ScanView extends LitElement {
  @property() scan!: ScanSelection;
  @property() feature!: Feature;
  viewer = createRef<ItkViewer2d>();

  stateService = new ContextConsumer(this, {
    context: appContext,
    subscribe: true,
  });

  focusScan() {
    if (this.scan)
      this.stateService.value?.service.send({
        type: 'FOCUS_SCAN',
        id: this.scan.id,
      });
  }

  async updateImage() {
    const path = getImage(this.feature);
    const url = new URL(path);
    const zarrImage = await ZarrMultiscaleSpatialImage.fromUrl(url);
    const viewerActor = this.viewer.value?.getActor();
    viewerActor?.send({ type: 'setImage', image: zarrImage });
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('scan') || changedProperties.has('feature')) {
      this.updateImage();
    }
  }

  render() {
    const selectionColor = {
      '--md-elevated-button-container-color': this.scan?.color,
    };
    return html`
      <div class="viewport">
        <itk-viewer-2d ${ref(this.viewer)}></itk-viewer-2d>
        ${this.scan
          ? html`<md-elevated-button
              class="focus-scan"
              style=${styleMap(selectionColor)}
              @click="${this.focusScan}"
              >Case ID: ${this.scan.id}</md-elevated-button
            >`
          : undefined}
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;

      min-width: 20rem;
      min-height: 20rem;
      display: flex;
    }

    .viewport {
      flex: 1;

      display: flex;
      justify-content: center;
    }

    img {
      object-fit: cover;
    }

    .focus-scan {
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
    }

    md-elevated-button {
      --md-elevated-button-label-text-color: black;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'scan-view': ScanView;
  }
}
