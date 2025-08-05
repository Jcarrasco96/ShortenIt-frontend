export interface User {

  id: string;
  name: string;
  email: string;
  phone_number: string;
  status: string;
  position: string;
  npi: string | null;
  driver_license: string | null;
  professional_license: string | null;
  professional_license2: string | null;
  ahca: string | null;
  fars: string | null;
  cfars: string | null;
  cpr: string | null;
  first_aid: string | null;
  hipaa: string | null;
  osha: string | null;
  hiv_aids: string | null;
  domestic_violence: string | null;
  medical_error: string | null;
  infection_control: string | null;
  patient_rights: string | null;

}
