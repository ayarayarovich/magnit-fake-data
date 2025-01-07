export interface Employee {
  employee_id?: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  birth_date: Date;
  department_id: number | null;
  role_id: number | null;
  work_phone: string | null;
  personal_phone: string | null;
  email: string | null;
  inn: number | null;
  snils: number | null;
  hire_date: Date;
  medical_check_date: Date | null;
  gender: boolean;
}

export interface Passport {
  passport_id?: number;
  employee_id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  gender: boolean;
  series: number;
  number: number;
  department_code: number;
  registration_address: string;
  birth_date: Date;
  issue_date: Date;
}

export interface ForeignPassport {
  passport_id?: number;
  employee_id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  gender: boolean;
  number: number;
  citizenship: string;
  department_code: number;
  birth_date: Date;
  issue_date: Date;
  expiry_date: Date;
}

export interface MilitaryID {
  military_id_number: number;
  employee_id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  commissariat_address: string;
  place_of_birth: string;
  education: string;
  category: string;
}

export interface Supplier {
  supplier_id?: number;
  supplier_name: string;
  taxpayer_id: string;
  registration_id: string;
  legal_address: string;
  actual_address: string;
  mobile_phone: string;
  email: string;
  manager_phone: string;
}
