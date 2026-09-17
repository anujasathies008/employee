/*
# Create employees table (single-tenant, no auth)

1. New Tables
- `employees`
  - `id` (uuid, primary key)
  - `employee_id` (text, unique, auto-generated EMP001-style code)
  - `full_name` (text, not null)
  - `email` (text, unique, not null)
  - `phone` (text, not null)
  - `gender` (text: Male/Female/Other)
  - `date_of_birth` (date)
  - `department` (text: HR/IT/Finance/Marketing/Sales/Operations/Engineering)
  - `designation` (text)
  - `date_of_joining` (date, not null)
  - `salary` (numeric, not null, > 0)
  - `address` (text)
  - `city` (text)
  - `state` (text)
  - `pincode` (text)
  - `status` (text: Active/Inactive, default Active)
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)

2. Security
- Enable RLS on `employees`.
- Allow anon + authenticated full CRUD (single-tenant, no sign-in screen).

3. Indexes
- Index on employee_id, email, department, status for fast lookups.
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  gender text DEFAULT 'Male',
  date_of_birth date,
  department text NOT NULL,
  designation text NOT NULL,
  date_of_joining date NOT NULL,
  salary numeric(12,2) NOT NULL CHECK (salary > 0),
  address text,
  city text,
  state text,
  pincode text,
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_employees" ON employees;
CREATE POLICY "anon_select_employees" ON employees FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_employees" ON employees;
CREATE POLICY "anon_insert_employees" ON employees FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_employees" ON employees;
CREATE POLICY "anon_update_employees" ON employees FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_employees" ON employees;
CREATE POLICY "anon_delete_employees" ON employees FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS employees_updated_at ON employees;
CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();