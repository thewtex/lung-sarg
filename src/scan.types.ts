export type ScanId = string;

export interface Scan {
  'Case ID': ScanId;
  'Patient affiliation': string;
  'Age at Histological Diagnosis': number;
  'Weight (lbs)': number;
  Gender: string;
  Ethnicity: string;
  'Smoking status': string;
  'Pack Years': number;
  'Quit Smoking Year': number;
  '%GG': number;
  'Tumor Location (choice=RUL)': string;
  'Tumor Location (choice=RML)': string;
  'Tumor Location (choice=RLL)': string;
  'Tumor Location (choice=LUL)': string;
  'Tumor Location (choice=LLL)': string;
  'Tumor Location (choice=L Lingula)': string;
  'Tumor Location (choice=Unknown)': string;
  Histology: string;
  'Pathological T stage': string;
  'Pathological N stage': string;
  'Pathological M stage': string;
  'Histopathological Grade': string;
  'Lymphovascular invasion': string;
  'Pleural invasion (elastic, visceral, or parietal)': string;
  'EGFR mutation status': string;
  'KRAS mutation status': string;
  'ALK translocation status': string;
  'Adjuvant Treatment': string;
  Chemotherapy: string;
  Radiation: string;
  Recurrence: string;
  'Recurrence Location': string;
  'Date of Recurrence': string;
  'Date of Last Known Alive': string;
  'Survival Status': string;
  'Date of Death': string;
  'Time to Death (days)': number;
  'CT Date': string;
  'Days between CT and surgery': number;
  'PET Date': string;
}

export type Field = keyof Scan;

// Make runtime array of fields
// Record type ensures, we have no double or missing keys, values can be neglected
function createKeys(keyRecord: Record<keyof Scan, any>): (keyof Scan)[] {
  return Object.keys(keyRecord) as any;
}

export const fields = createKeys({
  'Case ID': 1,
  'Patient affiliation': 1,
  'Age at Histological Diagnosis': 1,
  'Weight (lbs)': 1,
  Gender: 1,
  Ethnicity: 1,
  'Smoking status': 1,
  'Pack Years': 1,
  'Quit Smoking Year': 1,
  '%GG': 1,
  'Tumor Location (choice=RUL)': 1,
  'Tumor Location (choice=RML)': 1,
  'Tumor Location (choice=RLL)': 1,
  'Tumor Location (choice=LUL)': 1,
  'Tumor Location (choice=LLL)': 1,
  'Tumor Location (choice=L Lingula)': 1,
  'Tumor Location (choice=Unknown)': 1,
  Histology: 1,
  'Pathological T stage': 1,
  'Pathological N stage': 1,
  'Pathological M stage': 1,
  'Histopathological Grade': 1,
  'Lymphovascular invasion': 1,
  'Pleural invasion (elastic, visceral, or parietal)': 1,
  'EGFR mutation status': 1,
  'KRAS mutation status': 1,
  'ALK translocation status': 1,
  'Adjuvant Treatment': 1,
  Chemotherapy: 1,
  Radiation: 1,
  Recurrence: 1,
  'Recurrence Location': 1,
  'Date of Recurrence': 1,
  'Date of Last Known Alive': 1,
  'Survival Status': 1,
  'Date of Death': 1,
  'Time to Death (days)': 1,
  'CT Date': 1,
  'Days between CT and surgery': 1,
  'PET Date': 1,
});

export const FEATURES = {
  rawMri: {
    name: 'Machine Output',
    long: 'Raw image from the MRI machine',
  },
  cartilageThickness: {
    name: 'Cartilage Thickness',
    long: '3D model of the cartilage color mapped with local thickness',
  },
  volumeCartilage: {
    name: 'Volume Cartilage',
    long: 'Segmented cartilage in the MRI',
  },
} as const;

export type Feature = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as Feature[];
export const NAME_TO_KEY: Record<string, Feature> = Object.entries(
  FEATURES,
).reduce((nameToKeys, [key, { name }]) => ({ ...nameToKeys, [name]: key }), {});
