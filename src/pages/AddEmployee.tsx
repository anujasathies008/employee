import { useState } from 'react';
import EmployeeForm from '@/components/EmployeeForm';
import { supabase, type Employee } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

interface AddEmployeeProps {
  onDone: () => void;
}

export default function AddEmployee({ onDone }: AddEmployeeProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateEmployeeId = async (): Promise<string> => {
    const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true });
    const next = (count ?? 0) + 1;
    return `EMP${String(next).padStart(3, '0')}`;
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const employeeId = await generateEmployeeId();
      const { error } = await supabase.from('employees').insert({ ...data, employee_id: employeeId });
      if (error) {
        if (error.code === '23505') {
          showToast('An employee with this email already exists.', 'error');
        } else {
          showToast('Failed to add employee. Please try again.', 'error');
        }
      } else {
        showToast('Employee added successfully.', 'success');
        onDone();
      }
    } catch {
      showToast('Unable to connect to the server. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900">Add New Employee</h3>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a new employee record</p>
      </div>
      <EmployeeForm onSubmit={handleSubmit} onCancel={onDone} loading={loading} />
    </div>
  );
}
