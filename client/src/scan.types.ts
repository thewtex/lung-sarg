export type ScanId = string;

export interface Scan {
  'Patient ID': ScanId;
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

export const scanFieldInputTypes = [
  { name: 'Patient ID', type: 'text' },
  {
    name: 'Patient affiliation',
    type: 'text',
    default: '',
  },
  {
    name: 'Age at Histological Diagnosis',
    type: 'number',
    default: '',
  },
  {
    name: 'Weight (lbs)',
    type: 'number',
    default: '',
  },
  {
    name: 'Gender',
    type: 'select',
    default: 'Male',
    options: ['Male', 'Female'],
  },
  {
    name: 'Ethnicity',
    type: 'select',
    default: 'Caucasian',
    options: [
      'Caucasian',
      'Asian',
      'Black',
      'Hispanic/Latino',
      'Other',
      'Not Recorded',
    ],
  },
  {
    name: 'Smoking status',
    type: 'select',
    default: 'Former',
    options: ['Nonsmoker', 'Former', 'Current'],
  },
  {
    name: 'Pack Years',
    type: 'number',
    default: '',
  },
  {
    name: 'Quit Smoking Year',
    type: 'number',
    default: '',
  },
  {
    name: '%GG',
    type: 'select',
    default: '0%',
    options: [
      '0%',
      '>0 - 25%',
      '25 - 50%',
      '50 - 75%',
      '75 - < 100%',
      '100%',
      'Not Assessed',
    ],
  },
  {
    name: 'Tumor Location (choice=RUL)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=RML)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=RLL)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=LUL)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=LLL)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=L Lingula)',
    type: 'checkbox',
  },
  {
    name: 'Tumor Location (choice=Unknown)',
    type: 'checkbox',
  },
  {
    name: 'Histology',
    type: 'select',
    default: 'Adenocarcinoma',
    options: [
      'Adenocarcinoma',
      'Squamous cell carcinoma',
      'NSCLC NOS (not otherwise specified)',
    ],
  },
  {
    name: 'Pathological T stage',
    type: 'select',
    default: 'Not Collected',
    options: ['Not Collected', 'T1a', 'T1b', 'T2a', 'T2b', 'T3', 'T4', 'Tis'],
  },
  {
    name: 'Pathological N stage',
    type: 'select',
    default: 'N0',
    options: ['N0', 'N1', 'N2', 'Not Collected'],
  },
  {
    name: 'Pathological M stage',
    type: 'select',
    default: 'M0',
    options: ['M0', 'M1a', 'Not Collected'],
  },
  {
    name: 'Histopathological Grade',
    type: 'select',
    default: 'G2 Moderately differentiated',
    options: [
      'Not Collected',
      'G1 Well differentiated',
      'G2 Moderately differentiated',
      'G3 Poorly differentiated',
      'Other, Type I: Well to moderately differentiated',
      'Other, Type II: Moderately to poorly differentiated',
    ],
  },
  {
    name: 'Lymphovascular invasion',
    type: 'select',
    default: 'Absent',
    options: ['Not Collected', 'Absent', 'Present'],
  },
  {
    name: 'Pleural invasion (elastic, visceral, or parietal)',
    type: 'select',
    default: 'No',
    options: ['Not Collected', 'No', 'Yes'],
  },
  {
    name: 'EGFR mutation status',
    type: 'select',
    default: 'Wildtype',
    options: ['Not collected', 'Wildtype', 'Mutant'],
  },
  {
    name: 'KRAS mutation status',
    type: 'select',
    default: 'Wildtype',
    options: ['Not collected', 'Wildtype', 'Mutant'],
  },
  {
    name: 'ALK translocation status',
    type: 'select',
    default: 'Wildtype',
    options: ['Not collected', 'Wildtype', 'Mutant'],
  },
  {
    name: 'Adjuvant Treatment',
    type: 'select',
    default: 'No',
    options: ['No', 'Yes'],
  },
  {
    name: 'Chemotherapy',
    type: 'select',
    default: 'No',
    options: ['No', 'Yes'],
  },
  { name: 'Radiation', type: 'select', default: 'No', options: ['No', 'Yes'] },
  { name: 'Recurrence', type: 'select', default: 'No', options: ['No', 'Yes'] },
  {
    name: 'Recurrence Location',
    type: 'select',
    default: 'distant',
    options: ['distant', 'regional', 'N/A'],
  },
  {
    name: 'Date of Recurrence',
    type: 'date',
  },
  {
    name: 'Date of Last Known Alive',
    type: 'date',
  },
  {
    name: 'Survival Status',
    type: 'select',
    default: 'Alive',
    options: ['Alive', 'Dead'],
  },
  {
    name: 'Date of Death',
    type: 'date',
  },
  {
    name: 'Time to Death (days)',
    type: 'number',
    default: '',
  },
  {
    name: 'CT Date',
    type: 'date',
  },
  {
    name: 'Days between CT and surgery',
    type: 'number',
    default: '',
  },
  {
    name: 'PET Date',
    type: 'date',
  },
] as const;

export type Field = keyof Scan;

// Make runtime array of fields
// Record type ensures, we have no double or missing keys, values can be neglected
function createKeys(keyRecord: Record<keyof Scan, any>): (keyof Scan)[] {
  return Object.keys(keyRecord) as any;
}

export const fields = createKeys({
  'Patient ID': 1,
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
  ct: {
    name: 'CT',
    long: 'Computed Tomography',
  },
  pet: {
    name: 'PET',
    long: 'Positron Emission Tomography',
  },
  mri: {
    name: 'MRI',
    long: 'Magnetic Resonance Imaging',
  },
  dx: {
    name: 'XRay',
    long: 'Lungs',
  },
} as const;

export type Feature = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as Feature[];
export const NAME_TO_KEY: Record<string, Feature> = Object.entries(
  FEATURES,
).reduce((nameToKeys, [key, { name }]) => ({ ...nameToKeys, [name]: key }), {});
