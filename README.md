# Employee Management System

A full-stack web application for managing employee records with complete CRUD operations, search, filtering, sorting, dashboard analytics, reporting, and CSV export. Built as a college project demonstration.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Objectives](#objectives)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Project Structure](#project-structure)
8. [Database Design](#database-design)
9. [API Endpoints](#api-endpoints)
10. [Installation](#installation)
11. [How to Run](#how-to-run)
12. [Postman / API Testing](#postman--api-testing)
13. [Sample API Requests](#sample-api-requests)
14. [Validation Rules](#validation-rules)
15. [Test Cases](#test-cases)
16. [Future Enhancements](#future-enhancements)

---

## Project Overview

The Employee Management System (EMS) is a web-based application that allows administrators or HR personnel to digitally manage employee records. It provides a clean, professional interface for adding, viewing, editing, deleting, searching, filtering, and sorting employee data. All records are persisted in a PostgreSQL database, ensuring data survives browser refreshes and application restarts.

The application includes a real-time dashboard with statistics and charts, a reports page with CSV export, and full validation on both the frontend and database levels.

---

## Problem Statement

Traditional employee record management relies on spreadsheets or paper files, which are prone to errors, difficult to search, and hard to maintain. This system replaces that process with a centralized digital platform where employee data can be managed efficiently through a modern web interface with persistent storage.

---

## Objectives

- Provide a digital platform for managing employee records
- Support full CRUD operations (Create, Read, Update, Delete)
- Enable searching by employee ID, name, email, department, or designation
- Enable filtering by department, status, and gender
- Enable sorting by name, employee ID, date of joining, salary, and department
- Display real-time dashboard statistics with visual charts
- Generate reports with department-wise breakdowns and CSV export
- Validate all user input on both frontend and database levels
- Ensure data persistence across browser refreshes

---

## Features

| Feature | Description |
|---|---|
| Dashboard | Total, active, inactive, department count, gender breakdown, department bar chart, status donut chart, recent employees |
| Employee List | Paginated table with search, filters, sortable columns, view/edit/delete actions |
| Add Employee | Full form with personal, job, and address sections with inline validation |
| Edit Employee | Pre-filled form to update any employee record |
| Delete Employee | Confirmation dialog before permanent deletion |
| View Details | Modal showing complete employee profile |
| Search | Dynamic search by employee ID, name, email, department, designation |
| Filters | Department, status, and gender filters (work simultaneously with search) |
| Sorting | Click column headers to sort ascending/descending |
| Pagination | 8 records per page with previous/next navigation |
| Reports | Department-wise counts, gender distribution, status summary, CSV export |
| Toast Notifications | Success and error messages after every operation |
| Loading States | Spinners during API calls, disabled buttons to prevent duplicate submissions |
| Responsive Design | Works on desktop, laptop, tablet, and mobile |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Build Tool | Vite 5 |
| Database | PostgreSQL (via Supabase) |
| API | Supabase REST API (auto-generated from database schema) |
| Data Validation | Frontend (TypeScript) + Backend (PostgreSQL constraints) |

---

## System Architecture

```
User
  ↓
React Frontend (TypeScript + Tailwind CSS)
  ↓
Supabase JavaScript Client (Fetch API)
  ↓
Supabase REST API
  ↓
PostgreSQL Database
```

The frontend communicates directly with the Supabase REST API, which is auto-generated from the PostgreSQL schema. The Supabase client library handles authentication (anon key), request formatting, and response parsing. Row Level Security (RLS) policies on the database control access.

---

## Project Structure

```
project/
│
├── index.html                  # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables (Supabase URL + anon key)
│
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component with routing and layout
│   ├── index.css                # Global styles + Tailwind directives
│   │
│   ├── lib/
│   │   └── supabase.ts          # Supabase client, Employee type, constants
│   │
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar (Dashboard, Employees, Add, Reports, About)
│   │   ├── Topbar.tsx           # Top header bar with page title and status indicator
│   │   ├── StatsCard.tsx        # Reusable dashboard statistics card
│   │   ├── LoadingSpinner.tsx   # Reusable loading indicator
│   │   ├── Toast.tsx            # Toast notification system (success/error/info)
│   │   ├── ConfirmDialog.tsx    # Reusable confirmation dialog (used for delete)
│   │   ├── EmployeeForm.tsx     # Reusable add/edit form with validation
│   │   └── EmployeeDetails.tsx  # Employee profile modal
│   │
│   └── pages/
│       ├── Dashboard.tsx        # Statistics, charts, recent employees
│       ├── EmployeeList.tsx     # Table with search, filter, sort, pagination, CRUD actions
│       ├── AddEmployee.tsx      # Add new employee flow
│       ├── EditEmployee.tsx     # Edit existing employee flow
│       ├── Reports.tsx          # Analytics tables, gender distribution, CSV export
│       └── About.tsx           # About page with features, tech stack, workflow
│
└── supabase/
    └── migrations/
        └── 20260917035422_create_employees_table.sql  # Database schema
```

---

## Database Design

### Table: `employees`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Internal unique identifier |
| `employee_id` | text | UNIQUE, NOT NULL | Auto-generated employee code (EMP001, EMP002, ...) |
| `full_name` | text | NOT NULL | Employee full name |
| `email` | text | UNIQUE, NOT NULL | Email address (unique) |
| `phone` | text | NOT NULL | 10-digit phone number |
| `gender` | text | DEFAULT 'Male' | Male / Female / Other |
| `date_of_birth` | date | nullable | Date of birth |
| `department` | text | NOT NULL | HR / IT / Finance / Marketing / Sales / Operations / Engineering |
| `designation` | text | NOT NULL | Job title |
| `date_of_joining` | date | NOT NULL | Joining date |
| `salary` | numeric(12,2) | NOT NULL, CHECK (salary > 0) | Salary amount |
| `address` | text | nullable | Street address |
| `city` | text | nullable | City |
| `state` | text | nullable | State |
| `pincode` | text | nullable | 6-digit pincode |
| `status` | text | NOT NULL, DEFAULT 'Active' | Active / Inactive |
| `created_at` | timestamptz | DEFAULT now() | Record creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp (auto-updated via trigger) |

### Indexes

| Index | Column | Purpose |
|---|---|---|
| `idx_employees_employee_id` | employee_id | Fast lookup by employee code |
| `idx_employees_email` | email | Fast lookup / uniqueness check |
| `idx_employees_department` | department | Fast filtering by department |
| `idx_employees_status` | status | Fast filtering by status |

### Database Constraints

- `employee_id` is UNIQUE — no two employees can share the same code
- `email` is UNIQUE — no two employees can share the same email
- `salary` has a CHECK constraint — must be greater than 0
- `updated_at` is automatically updated via a BEFORE UPDATE trigger

### Row Level Security (RLS)

RLS is enabled on the `employees` table. Since this is a single-tenant application without a sign-in screen, four policies grant full CRUD access to both `anon` and `authenticated` roles:

| Policy | Command | Role |
|---|---|---|
| `anon_select_employees` | SELECT | anon, authenticated |
| `anon_insert_employees` | INSERT | anon, authenticated |
| `anon_update_employees` | UPDATE | anon, authenticated |
| `anon_delete_employees` | DELETE | anon, authenticated |

---

## API Endpoints

The application uses the Supabase REST API, which is auto-generated from the database schema. The base URL is configured in the `.env` file.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/rest/v1/employees?select=*` | Retrieve all employees |
| GET | `/rest/v1/employees?id=eq.{id}` | Retrieve a single employee by ID |
| POST | `/rest/v1/employees` | Create a new employee |
| PATCH | `/rest/v1/employees?id=eq.{id}` | Update an existing employee |
| DELETE | `/rest/v1/employees?id=eq.{id}` | Delete an employee |

### API Response Format

All responses are JSON.

**Successful GET (all employees):**
```json
[
  {
    "id": "uuid-here",
    "employee_id": "EMP001",
    "full_name": "Arun Kumar",
    "email": "arun.kumar@example.com",
    "phone": "9876543210",
    "gender": "Male",
    "date_of_birth": "1995-03-15",
    "department": "IT",
    "designation": "Software Developer",
    "date_of_joining": "2026-06-10",
    "salary": 45000,
    "address": "123 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "status": "Active",
    "created_at": "2026-09-17T03:54:22+00:00",
    "updated_at": "2026-09-17T03:54:22+00:00"
  }
]
```

**Successful POST returns:** HTTP 201 with created employee data
**Successful GET returns:** HTTP 200 with JSON array
**Successful UPDATE returns:** HTTP 200 with updated data
**Successful DELETE returns:** HTTP 200 with empty body
**Validation errors return:** HTTP 400 with error details
**Duplicate email/employee_id returns:** HTTP 409 with constraint violation

---

## Installation

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Frontend Setup

```bash
# 1. Install dependencies
npm install

# 2. The .env file is already configured with Supabase credentials
#    No additional setup required for the database

# 3. Start the development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Database Setup

The database is already provisioned via Supabase. The migration file at `supabase/migrations/20260917035422_create_employees_table.sql` has been applied. It creates the `employees` table, indexes, RLS policies, and the `updated_at` trigger.

Sample data (8 employees) has been seeded into the database.

---

## How to Run

### Development Mode

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build      # Build the project
npm run preview     # Preview the production build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## Postman / API Testing

Since the application uses Supabase's REST API, you can test all endpoints using Postman or any HTTP client.

### Setup in Postman

1. **Base URL:** Find `VITE_SUPABASE_URL` in the `.env` file. The REST API base is `{VITE_SUPABASE_URL}/rest/v1/`
2. **Headers required for all requests:**
   ```
   apikey: {VITE_SUPABASE_ANON_KEY}
   Authorization: Bearer {VITE_SUPABASE_ANON_KEY}
   Content-Type: application/json
   ```

### Test Cases

#### 1. GET All Employees

- **Method:** GET
- **URL:** `{BASE_URL}/rest/v1/employees?select=*`
- **Expected:** HTTP 200 with JSON array of all employees

#### 2. GET Employee by ID

- **Method:** GET
- **URL:** `{BASE_URL}/rest/v1/employees?id=eq.{uuid}`
- **Expected:** HTTP 200 with single employee object

#### 3. POST (Create Employee)

- **Method:** POST
- **URL:** `{BASE_URL}/rest/v1/employees`
- **Body:**
  ```json
  {
    "employee_id": "EMP009",
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "9876543299",
    "gender": "Male",
    "department": "IT",
    "designation": "Tester",
    "date_of_joining": "2026-09-01",
    "salary": 40000,
    "status": "Active"
  }
  ```
- **Expected:** HTTP 201 with created employee data

#### 4. PUT/PATCH (Update Employee)

- **Method:** PATCH
- **URL:** `{BASE_URL}/rest/v1/employees?id=eq.{uuid}`
- **Body:**
  ```json
  {
    "salary": 50000,
    "designation": "Senior Tester"
  }
  ```
- **Expected:** HTTP 200 with updated data

#### 5. DELETE Employee

- **Method:** DELETE
- **URL:** `{BASE_URL}/rest/v1/employees?id=eq.{uuid}`
- **Expected:** HTTP 200 with empty body

#### 6. Validation Tests

| Test | Input | Expected |
|---|---|---|
| Empty required fields | POST with `full_name: ""` | HTTP 400 |
| Invalid email | POST with `email: "notanemail"` | HTTP 400 |
| Invalid phone | POST with `phone: "123"` | HTTP 400 (frontend blocks, DB accepts) |
| Duplicate email | POST with existing email | HTTP 409 |
| Duplicate employee_id | POST with existing EMP001 | HTTP 409 |
| Invalid salary | POST with `salary: -100` | HTTP 400 (CHECK constraint) |
| Non-existent employee ID | GET with invalid UUID | HTTP 200 with empty array |

---

## Sample API Requests

### Create Employee

```bash
curl -X POST "{BASE_URL}/rest/v1/employees" \
  -H "apikey: {ANON_KEY}" \
  -H "Authorization: Bearer {ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP010",
    "full_name": "New Employee",
    "email": "new@example.com",
    "phone": "9876543300",
    "gender": "Female",
    "department": "Sales",
    "designation": "Sales Lead",
    "date_of_joining": "2026-09-15",
    "salary": 55000,
    "status": "Active"
  }'
```

### Get All Employees

```bash
curl -X GET "{BASE_URL}/rest/v1/employees?select=*" \
  -H "apikey: {ANON_KEY}" \
  -H "Authorization: Bearer {ANON_KEY}"
```

### Update Employee

```bash
curl -X PATCH "{BASE_URL}/rest/v1/employees?id=eq.{uuid}" \
  -H "apikey: {ANON_KEY}" \
  -H "Authorization: Bearer {ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"salary": 60000}'
```

### Delete Employee

```bash
curl -X DELETE "{BASE_URL}/rest/v1/employees?id=eq.{uuid}" \
  -H "apikey: {ANON_KEY}" \
  -H "Authorization: Bearer {ANON_KEY}"
```

---

## Validation Rules

### Frontend Validation (in EmployeeForm.tsx)

| Field | Rule |
|---|---|
| Full Name | Required, minimum 3 characters, only letters/spaces/dots/apostrophes/hyphens |
| Email | Required, must match standard email regex |
| Phone | Required, exactly 10 digits (numbers only, enforced on input) |
| Department | Required (dropdown selection) |
| Designation | Required |
| Date of Joining | Required |
| Salary | Required, must be numeric, must be greater than 0 |
| Pincode | Optional, but if provided must be exactly 6 digits |

### Backend Validation (Database Constraints)

| Constraint | Rule |
|---|---|
| `employee_id` UNIQUE | No duplicate employee IDs |
| `email` UNIQUE | No duplicate emails |
| `salary` CHECK | Must be greater than 0 |
| `full_name` NOT NULL | Cannot be null |
| `email` NOT NULL | Cannot be null |
| `phone` NOT NULL | Cannot be null |
| `department` NOT NULL | Cannot be null |
| `designation` NOT NULL | Cannot be null |
| `date_of_joining` NOT NULL | Cannot be null |
| `salary` NOT NULL | Cannot be null |
| `status` NOT NULL | Cannot be null, defaults to 'Active' |

---

## Test Cases

| Test Case ID | Test Description | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Create new employee with valid data | Full form with all required fields | Employee created, success toast shown, appears in list | Employee created successfully | PASS |
| TC-02 | Create employee with empty name | full_name = "" | Validation error "Full name is required" shown below field | Error displayed | PASS |
| TC-03 | Create employee with name < 3 chars | full_name = "AB" | Validation error "Name must be at least 3 characters" | Error displayed | PASS |
| TC-04 | Create employee with invalid email | email = "notanemail" | Validation error "Invalid email format" shown | Error displayed | PASS |
| TC-05 | Create employee with duplicate email | email = existing email | Error toast "An employee with this email already exists" | Error toast shown | PASS |
| TC-06 | Create employee with invalid phone | phone = "123" | Validation error "Phone must be exactly 10 digits" | Error displayed | PASS |
| TC-07 | Create employee with salary <= 0 | salary = 0 | Validation error "Salary must be greater than 0" | Error displayed | PASS |
| TC-08 | Create employee with invalid pincode | pincode = "123" | Validation error "Pincode must be exactly 6 digits" | Error displayed | PASS |
| TC-09 | View all employees on list page | Navigate to Employees page | Table displays all employees from database | Employees displayed | PASS |
| TC-10 | Search employee by name | Type "Arun" in search box | Only employees matching "Arun" shown | Filtered results shown | PASS |
| TC-11 | Filter employees by department | Select "IT" from department filter | Only IT department employees shown | Filtered results shown | PASS |
| TC-12 | Filter employees by status | Select "Inactive" from status filter | Only inactive employees shown | Filtered results shown | PASS |
| TC-13 | Sort employees by salary | Click "Salary" column header | Employees sorted by salary ascending/descending | Sorted correctly | PASS |
| TC-14 | Edit employee details | Change designation and save | Success toast shown, updated data in list | Updated successfully | PASS |
| TC-15 | Delete employee with confirmation | Click delete, confirm in dialog | Employee removed, success toast shown | Deleted successfully | PASS |
| TC-16 | Cancel delete operation | Click delete, click Cancel in dialog | Employee remains in list, no changes | Employee preserved | PASS |
| TC-17 | View employee details | Click eye icon on a row | Modal opens with all employee fields | Details displayed | PASS |
| TC-18 | Pagination navigation | Click Next/Previous buttons | Correct page of employees displayed | Pagination works | PASS |
| TC-19 | Dashboard statistics accuracy | Add/delete employee, check dashboard | Stats update to reflect current data | Stats accurate | PASS |
| TC-20 | Data persistence after refresh | Add employee, refresh browser | Employee still present in list | Data persisted | PASS |
| TC-21 | CSV export | Click "Export Employee Report" on Reports page | CSV file downloads with all employee data | CSV downloaded | PASS |
| TC-22 | Responsive design on mobile | Resize to 375px width | Sidebar collapses, table scrolls horizontally | Layout adapts | PASS |
| TC-23 | API GET all employees | GET /rest/v1/employees | HTTP 200 with JSON array | 200 OK | PASS |
| TC-24 | API POST create employee | POST with valid data | HTTP 201 with created record | 201 Created | PASS |
| TC-25 | API PATCH update employee | PATCH with new salary | HTTP 200 with updated record | 200 OK | PASS |
| TC-26 | API DELETE employee | DELETE by ID | HTTP 200, record removed | 200 OK | PASS |
| TC-27 | API duplicate email error | POST with existing email | HTTP 409 conflict | 409 returned | PASS |
| TC-28 | API invalid salary | POST with salary = -100 | HTTP 400 (CHECK constraint) | 400 returned | PASS |
| TC-29 | Empty state when no employees | Delete all or filter with no matches | "No employees found" message displayed | Empty state shown | PASS |
| TC-30 | Multiple filters combined | Search + department + status + gender | Results match all filter criteria | Combined filtering works | PASS |

---

## Sample Data

The database is pre-seeded with 8 sample employees:

| Employee ID | Name | Department | Designation | Status |
|---|---|---|---|---|
| EMP001 | Arun Kumar | IT | Software Developer | Active |
| EMP002 | Priya Sharma | HR | HR Executive | Active |
| EMP003 | Karthik Raj | Finance | Accountant | Active |
| EMP004 | Divya S | Marketing | Marketing Executive | Active |
| EMP005 | Rahul Kumar | Engineering | System Engineer | Active |
| EMP006 | Sneha Reddy | IT | Frontend Developer | Active |
| EMP007 | Vikram Singh | Operations | Operations Manager | Inactive |
| EMP008 | Anita Gupta | Sales | Sales Executive | Active |

---

## CRUD Workflow

### CREATE
```
User enters employee details
  ↓
Frontend validation (name, email, phone, salary, pincode)
  ↓
Auto-generate employee_id (EMP###)
  ↓
POST request to Supabase REST API
  ↓
Database validates (UNIQUE constraints, CHECK constraints)
  ↓
Record inserted into PostgreSQL
  ↓
Success response → UI shows toast → List refreshes
```

### READ
```
User opens Employee List or Dashboard
  ↓
GET request to Supabase REST API
  ↓
PostgreSQL retrieves records
  ↓
JSON response returned
  ↓
React renders table/dashboard
```

### UPDATE
```
User clicks Edit → Form pre-filled with existing data
  ↓
User modifies fields
  ↓
Frontend validation
  ↓
PATCH request to Supabase REST API
  ↓
Database validates + trigger updates updated_at
  ↓
Updated record returned
  ↓
Success toast → List refreshes
```

### DELETE
```
User clicks Delete
  ↓
Confirmation dialog shown
  ↓
User confirms
  ↓
DELETE request to Supabase REST API
  ↓
Record removed from PostgreSQL
  ↓
Success toast → List refreshes
```

---

## Future Enhancements

- User authentication with login/signup
- Role-based access control (admin vs viewer)
- Employee photo upload
- Bulk import via CSV
- Email notifications for status changes
- Department management (add/edit departments)
- Attendance tracking
- Leave management
- Salary slip generation
- Export to PDF
- Advanced reporting with date range filters
- Audit log of all changes
