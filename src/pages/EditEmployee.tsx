import { useState } from 'react';
import EmployeeForm from '@/components/EmployeeForm';
import { supabase, type Employee } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

interface EditEmployeeProps {
  employee: Employee;
  onDone: () => void;
}

export default function EditEmployee({ employee, onDone }: EditEmployeeProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('employees').update(data).eq('id', employee.id);
      if (error) {
        if (error.code === '23505') {
          showToast('An employee with this email already exists.', 'error');
        } else {
          showToast('Failed to update employee. Please try again.', 'error');
        }
      } else {
        showToast('Employee details updated successfully.', 'success');
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
        <h3 className="text-lg font-bold text-gray-900">Edit Employee</h3>
        <p className="text-sm text-gray-500 mt-0.5">Update the details for {employee.full_name} ({employee.employee_id})</p>
      </div>
      <EmployeeForm initialData={employee} onSubmit={handleSubmit} onCancel={onDone} loading={loading} />
    </div>
  );
}
