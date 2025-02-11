import { createContext } from '@lit/context';
import {
  assign,
  ContextFrom,
  StateFrom,
  createActor,
  setup,
  assertEvent,
  enqueueActions,
} from 'xstate';

import {
  Field,
  fields,
  ScanId,
  FEATURE_KEYS,
  Feature,
  Scan,
} from '../scan.types.js';
import * as ScanSelections from './scan-selections.js';
import { Page, getPage } from '../pages.js';

export type PlotParameter = 'leftBiomarker' | 'bottomBiomarker';
export type ScanClicked = {
  type: 'SCAN_CLICKED';
  id: ScanId;
};
export type FeatureViewId = string;

function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}

type Context = {
  populationScanSelectionsPool: ScanSelections.ScanSelectionsPool;
  individualScanSelectionsPool: ScanSelections.ScanSelectionsPool;
  scanSelectionsPool: ScanSelections.ScanSelectionsPool;
  features: Record<FeatureViewId, Feature>;
  featureViewCount: number;
  plotParameters: { leftBiomarker: Field; bottomBiomarker: Field };
  focusScan?: { id: ScanId }; // fresh object every event
  scans: Scan[];
  page: Page;
};

const machine = setup({
  types: {} as {
    events:
      | {
          type: 'PLOT_PARAMETER_CHANGED';
          parameter: PlotParameter;
          value: Field;
        }
      | ScanClicked
      | {
          type: 'FEATURE_SELECT';
          featureViewId: FeatureViewId;
          feature: Feature;
        }
      | {
          type: 'FEATURE_ADD';
        }
      | {
          type: 'FEATURE_REMOVE';
          featureViewId: FeatureViewId;
        }
      | {
          type: 'FOCUS_SCAN';
          id: ScanId;
        }
      | {
          type: 'PATIENT_ADD';
          fields: Scan;
        }
      | {
          type: 'NAVIGATE';
          page: Page;
        };
    context: Context;
    input: Partial<Context>;
  },
  actions: {
    toggleScanSelected: assign({
      scanSelectionsPool: ({
        context: { scanSelectionsPool: scanSelection },
        event,
      }) => {
        assertEvent(event, 'SCAN_CLICKED');
        const { id } = event;
        return ScanSelections.toggle(id, scanSelection);
      },
    }),

    assignFeature: assign({
      features: ({ context: { features }, event }) => {
        assertEvent(event, 'FEATURE_SELECT');
        const { featureViewId, feature } = event;
        if (!FEATURE_KEYS.includes(feature)) return features;
        return Object.assign({}, features, { [featureViewId]: feature });
      },
    }),

    addFeature: assign({
      featureViewCount: ({ context: { featureViewCount } }) =>
        featureViewCount + 1,
      features: ({ context: { features, featureViewCount } }) => ({
        ...features,
        [featureViewCount + 1]: FEATURE_KEYS[0],
      }),
    }),

    removeFeature: assign({
      features: ({ context: { features }, event }) => {
        assertEvent(event, 'FEATURE_REMOVE');
        const { featureViewId } = event;
        const { [featureViewId]: _, ...keep } = features;
        return keep;
      },
    }),

    assignParameter: assign({
      plotParameters: ({ context: { plotParameters }, event }) => {
        assertEvent(event, 'PLOT_PARAMETER_CHANGED');
        const { parameter, value } = event;
        return {
          ...plotParameters,
          [parameter]: value,
        };
      },
    }),

    addPatient: assign({
      scans: ({ context: { scans }, event }) => {
        assertEvent(event, 'PATIENT_ADD');
        const { fields } = event;
        return [...scans, fields];
      },
    }),

    assignPage: assign({
      page: ({ event }) => {
        assertEvent(event, 'NAVIGATE');
        const { page } = event;
        return page;
      },
    }),

    updateScanSelectionPool: assign({
      scanSelectionsPool: ({
        context: {
          populationScanSelectionsPool,
          individualScanSelectionsPool,
          page,
        },
      }) => {
        if (page === 'individual') {
          return individualScanSelectionsPool;
        }
        return populationScanSelectionsPool;
      },
    }),
  },
  guards: {
    onIndividualPage: ({ context: { page } }) => page === 'individual',
  },
}).createMachine({
  id: 'app',

  context: ({ input }: { input: Partial<Context> | undefined }) => {
    const populationScanSelectionsPool = ScanSelections.createSelectionPool(
      ScanSelections.POPULATION_SELECT_COLORS,
    );

    return {
      scanSelectionsPool: populationScanSelectionsPool,
      populationScanSelectionsPool,
      individualScanSelectionsPool: ScanSelections.createSelectionPool(
        ScanSelections.INDIVIDUAL_SELECT_COLORS,
      ),
      featureViewCount: 1,
      features: { '1': FEATURE_KEYS[0] }, // selected features to view
      plotParameters: {
        leftBiomarker: fields[0],
        bottomBiomarker: fields[1],
      },
      scans: [],
      page: getPage(),
      ...input,
    };
  },

  initial: 'running',
  states: {
    running: {
      entry: ['updateScanSelectionPool'],
      on: {
        PLOT_PARAMETER_CHANGED: { actions: 'assignParameter' },
        SCAN_CLICKED: {
          actions: [
            'toggleScanSelected',
            enqueueActions(({ context, enqueue, check }) => {
              if (check('onIndividualPage')) {
                enqueue.assign({
                  individualScanSelectionsPool: context.scanSelectionsPool,
                });
              } else {
                enqueue.assign({
                  populationScanSelectionsPool: context.scanSelectionsPool,
                });
              }
            }),
          ],
        },
        FEATURE_SELECT: { actions: 'assignFeature' },
        FEATURE_ADD: { actions: 'addFeature' },
        FEATURE_REMOVE: { actions: 'removeFeature' },
        FOCUS_SCAN: {
          actions: [assign({ focusScan: ({ event }) => ({ id: event.id }) })],
        },
        PATIENT_ADD: { actions: 'addPatient' },
        NAVIGATE: {
          actions: ['assignPage', 'updateScanSelectionPool'],
        },
      },
    },
  },
});
export type AppMachine = typeof machine;

export type AppService = ReturnType<typeof createService>;

function contextToJson(c: ContextFrom<typeof machine>) {
  return c;
}

function jsonToContext(json: any): ContextFrom<typeof machine> {
  return json;
}

const STATE_KEY = 'state';

export function saveState(state: StateFrom<AppMachine>) {
  const json = JSON.stringify(contextToJson(state.context));

  window.history.replaceState(
    null,
    '',
    `?${STATE_KEY}=${encodeToBinary(json)}`,
  );
}

function getSavedState() {
  const stateFromURL = new URL(document.location.href).searchParams.get(
    STATE_KEY,
  );
  if (stateFromURL) {
    try {
      const json = JSON.parse(decodeFromBinary(stateFromURL));
      return jsonToContext(json);
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

export const createService = () => {
  const context = getSavedState();

  const service = createActor(machine, { input: context }).start();
  service.subscribe((state) => saveState(state));
  return service;
};

export interface AppContext {
  service: AppService;
}

export const appContext = createContext<AppContext>('appService');
