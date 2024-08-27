import { Scan } from './scan.types';

const formToDb = {
  'Patient ID': 'patient_id',
  'Patient affiliation': 'patient_affiliation',
  'Age at Histological Diagnosis': 'age_at_histological_diagnosis',
  'Weight (lbs)': 'weight_lbs',
  Gender: 'gender',
  Ethnicity: 'ethnicity',
  'Smoking status': 'smoking_status',
  'Pack Years': 'pack_years',
  'Quit Smoking Year': 'quit_smoking_year',
  '%GG': 'percentgg',
  'Tumor Location (choice=RUL)': 'tumor_location_choice_rul',
  'Tumor Location (choice=RML)': 'tumor_location_choice_rml',
  'Tumor Location (choice=RLL)': 'tumor_location_choice_rll',
  'Tumor Location (choice=LUL)': 'tumor_location_choice_lul',
  'Tumor Location (choice=LLL)': 'tumor_location_choice_lll',
  'Tumor Location (choice=L Lingula)': 'tumor_location_choice_l_lingula',
  'Tumor Location (choice=Unknown)': 'tumor_location_choice_unknown',
  Histology: 'histology',
  'Pathological T stage': 'pathological_t_stage',
  'Pathological N stage': 'pathological_n_stage',
  'Pathological M stage': 'pathological_m_stage',
  'Histopathological Grade': 'histopathological_grade',
  'Lymphovascular invasion': 'lymphovascular_invasion',
  'Pleural invasion (elastic, visceral, or parietal)':
    'pleural_invasion_elastic_visceral_or_parietal',
  'EGFR mutation status': 'egfr_mutation_status',
  'KRAS mutation status': 'kras_mutation_status',
  'ALK translocation status': 'alk_translocation_status',
  'Adjuvant Treatment': 'adjuvant_treatment',
  Chemotherapy: 'chemotherapy',
  Radiation: 'radiation',
  Recurrence: 'recurrence',
  'Recurrence Location': 'recurrence_location',
  'Date of Recurrence': 'date_of_recurrence',
  'Date of Last Known Alive': 'date_of_last_known_alive',
  'Survival Status': 'survival_status',
  'Date of Death': 'date_of_death',
  'Time to Death (days)': 'time_to_death_days',
  'CT Date': 'ct_date',
  'Days between CT and surgery': 'days_between_ct_and_surgery',
  'PET Date': 'pet_date',
} as const;

const createPatient = (fields: Scan) => {
  const patient = {} as any;
  for (const [key, value] of Object.entries(fields)) {
    const dbKey = formToDb[key as keyof Scan];
    patient[dbKey] = value;
  }
  return patient;
};

// const createStudy = (fields: Scan) => {};

// const createSeries = (fields: Scan, files: FileList[]) => {};

export const sendStudy = async (fields: Scan, files: FileList[]) => {
  const patient = createPatient(fields);
  console.log(patient, files);
  // const study = createStudy(fields);
  // const series = createSeries(fields, files);
};
