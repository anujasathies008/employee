import { useState, type FormEvent } from 'react';
import { Save, X, RotateCcw } from 'lucide-react';
import { DEPARTMENTS, GENDERS, STATUSES, type Employee } from '@/lib/supabase';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
  gender: 'Male',
  date_of_birth: '',
  department: '',
  designation: '',
  date_of_joining: '',
  salary: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  status: 'Active',
};

export default function EmployeeForm({ initialData, onSubmit, onCancel, loading }: EmployeeFormProps) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        gender: initialData.gender,
        date_of_birth: initialData.date_of_birth ?? '',
        department: initialData.department,
        designation: initialData.designation,
        date_of_joining: initialData.date_of_joining,
        salary: String(initialData.salary),
        address: initialData.address ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        pincode: initialData.pincode ?? '',
        status: initialData.status,
      };
    }
    return { ...emptyForm };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    else if (form.full_name.trim().length < 3) e.full_name = 'Name must be at least 3 characters';
    else if (!/^[a-zA-Z\s.'-]+$/.test(form.full_name)) e.full_name = 'Name contains invalid characters';

    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';

    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be exactly 10 digits';

    if (!form.department) e.department = 'Department is required';
    if (!form.designation.trim()) e.designation = 'Designation is required';
    if (!form.date_of_joining) e.date_of_joining = 'Date of joining is required';

    if (!form.salary) e.salary = 'Salary is required';
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0) e.salary = 'Salary must be greater than 0';

    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = 'Pincode must be exactly 6 digits';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
      date_of_birth: form.date_of_birth || null,
      department: form.department,
      designation: form.designation.trim(),
      date_of_joining: form.date_of_joining,
      salary: Number(form.salary),
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      pincode: form.pincode.trim() || null,
      status: form.status,
    });
  };

  const handleClear = () => {
    setForm({ ...emptyForm });
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
      errors[field]
        ? 'border-red-300 bg-red-50/50 focus:border-red-400'
        : 'border-gray-200 bg-gray-50/50 focus:border-blue-400 focus:bg-white'
    }`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className={inputClass('full_name')}
              placeholder="e.g. Arun Kumar"
            />
            {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClass('email')}
              placeholder="e.g. arun@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              className={inputClass('phone')}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={inputClass('gender')}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className={inputClass('date_of_birth')}
            />
          </div>
          <div>
            <label className={labelClass}>Status <span className="text-red-500">*</span></label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClass('status')}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Job Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Department <span className="text-red-500">*</span></label>
            <select
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={inputClass('department')}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
          </div>
          <div>
            <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              className={inputClass('designation')}
              placeholder="e.g. Software Developer"
            />
            {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation}</p>}
          </div>
          <div>
            <label className={labelClass}>Date of Joining <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={form.date_of_joining}
              onChange={(e) => handleChange('date_of_joining', e.target.value)}
              className={inputClass('date_of_joining')}
            />
            {errors.date_of_joining && <p className="mt-1 text-xs text-red-500">{errors.date_of_joining}</p>}
          </div>
          <div>
            <label className={labelClass}>Salary <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">&#8377;</span>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                className={`${inputClass('salary')} pl-8`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className={`${inputClass('address')} resize-none`}
              placeholder="Street address"
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={inputClass('city')}
              placeholder="e.g. Bengaluru"
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={inputClass('state')}
              placeholder="e.g. Karnataka"
            />
          </div>
          <div>
            <label className={labelClass}>Pincode</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className={inputClass('pincode')}
              placeholder="6-digit pincode"
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {initialData ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}
