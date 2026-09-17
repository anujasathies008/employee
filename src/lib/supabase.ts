import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string | null;
  department: string;
  designation: string;
  date_of_joining: string;
  salary: number;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export type EmployeeInput = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

export const DEPARTMENTS = [
  'HR',
  'IT',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Engineering',
] as const;

export const GENDERS = ['Male', 'Female', 'Other'] as const;

export const STATUSES = ['Active', 'Inactive'] as const;
