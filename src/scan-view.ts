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

import { Feature } from './scan.types.js';
import { ScanSelection } from './state/scan-selections.js';
import { appContext } from './state/app.machine.js';

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
    const url = new URL(
      'https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.3/idr0079A/9836998.zarr',
    );
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
              >Scan: ${this.scan.id}</md-elevated-button
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
