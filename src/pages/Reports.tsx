import { useEffect, useState } from 'react';
import { Download, FileBarChart, Users, UserCheck, UserX, Building } from 'lucide-react';
import { supabase, type Employee, DEPARTMENTS } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Reports() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.error(error);
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Generating reports..." />;

  const total = employees.length;
  const active = employees.filter((e) => e.status === 'Active').length;
  const inactive = employees.filter((e) => e.status === 'Inactive').length;
  const male = employees.filter((e) => e.gender === 'Male').length;
  const female = employees.filter((e) => e.gender === 'Female').length;
  const other = employees.filter((e) => e.gender === 'Other').length;

  const deptCounts = DEPARTMENTS.map((d) => ({
    dept: d,
    count: employees.filter((e) => e.department === d).length,
  active: employees.filter((e) => e.department === d && e.status === 'Active').length,
  inactive: employees.filter((e) => e.department === d && e.status === 'Inactive').length,
  totalSalary: employees.filter((e) => e.department === d).reduce((s, e) => s + Number(e.salary), 0),
  }));

  const exportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Salary', 'Status'];
    const rows = employees.map((e) => [
      e.employee_id,
      e.full_name,
      e.email,
      e.phone,
      e.department,
      e.designation,
      e.date_of_joining,
      String(e.salary),
      e.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    { label: 'Total Employees', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Employees', value: active, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Inactive Employees', value: inactive, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Departments', value: new Set(employees.map((e) => e.department)).size, icon: Building, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Employee Reports</h3>
          <p className="text-sm text-gray-500">Analytics and data export for all employees</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={employees.length === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export Employee Report (CSV)
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} mb-3`}>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-blue-500" />
            Department-wise Employee Count
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium text-center">Total</th>
                  <th className="pb-2 font-medium text-center">Active</th>
                  <th className="pb-2 font-medium text-center">Inactive</th>
                  <th className="pb-2 font-medium text-right">Total Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deptCounts.map((d) => (
                  <tr key={d.dept} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 text-sm font-medium text-gray-900">{d.dept}</td>
                    <td className="py-2.5 text-sm text-gray-600 text-center">{d.count}</td>
                    <td className="py-2.5 text-sm text-emerald-600 text-center">{d.active}</td>
                    <td className="py-2.5 text-sm text-red-500 text-center">{d.inactive}</td>
                    <td className="py-2.5 text-sm font-medium text-gray-900 text-right tabular-nums">&#8377;{d.totalSalary.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" />
            Gender-wise Employee Count
          </h4>
          <div className="space-y-4">
            {[
              { label: 'Male', count: male, color: 'bg-cyan-500', text: 'text-cyan-600' },
              { label: 'Female', count: female, color: 'bg-pink-500', text: 'text-pink-600' },
              { label: 'Other', count: other, color: 'bg-violet-500', text: 'text-violet-600' },
            ].map((g) => (
              <div key={g.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{g.label}</span>
                  <span className={`text-sm font-bold ${g.text}`}>{g.count}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${g.color} transition-all duration-500`}
                    style={{ width: `${total > 0 ? (g.count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Status Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{active}</p>
                <p className="text-xs text-emerald-700 mt-1">Active Employees</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{inactive}</p>
                <p className="text-xs text-red-600 mt-1">Inactive Employees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
