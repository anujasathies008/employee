import { X, Pencil, Trash2, Mail, Phone, Calendar, MapPin, Briefcase, Building, User, Hash, IndianRupee, Clock } from 'lucide-react';
import type { Employee } from '@/lib/supabase';

interface EmployeeDetailsProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (e: Employee) => void;
  onDelete?: (e: Employee) => void;
}

export default function EmployeeDetails({ employee, onClose, onEdit, onDelete }: EmployeeDetailsProps) {
  if (!employee) return null;

  const fields = [
    { icon: Hash, label: 'Employee ID', value: employee.employee_id },
    { icon: User, label: 'Full Name', value: employee.full_name },
    { icon: Mail, label: 'Email', value: employee.email },
    { icon: Phone, label: 'Phone', value: employee.phone },
    { icon: User, label: 'Gender', value: employee.gender },
    { icon: Calendar, label: 'Date of Birth', value: employee.date_of_birth || '—' },
    { icon: Building, label: 'Department', value: employee.department },
    { icon: Briefcase, label: 'Designation', value: employee.designation },
    { icon: Calendar, label: 'Date of Joining', value: employee.date_of_joining },
    { icon: IndianRupee, label: 'Salary', value: `₹${Number(employee.salary).toLocaleString('en-IN')}` },
    { icon: MapPin, label: 'Address', value: employee.address || '—' },
    { icon: MapPin, label: 'City', value: employee.city || '—' },
    { icon: MapPin, label: 'State', value: employee.state || '—' },
    { icon: MapPin, label: 'Pincode', value: employee.pincode || '—' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Employee Details</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">
                {employee.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{employee.full_name}</h4>
                <p className="text-sm text-gray-500">{employee.designation} · {employee.department}</p>
                <span className={`inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{f.label}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Created: {new Date(employee.created_at).toLocaleDateString('en-IN')}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Updated: {new Date(employee.updated_at).toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          {onDelete && (
            <button
              onClick={() => { onDelete(employee); onClose(); }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
