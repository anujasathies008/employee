import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Building, Users2, UserCircle } from 'lucide-react';
import { supabase, type Employee } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard({ onNavigate }: { onNavigate: (page: 'employees' | 'add') => void }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const total = employees.length;
  const active = employees.filter((e) => e.status === 'Active').length;
  const inactive = employees.filter((e) => e.status === 'Inactive').length;
  const departments = new Set(employees.map((e) => e.department)).size;
  const male = employees.filter((e) => e.gender === 'Male').length;
  const female = employees.filter((e) => e.gender === 'Female').length;

  const deptCounts = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const deptEntries = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
  const maxDept = Math.max(...deptEntries.map(([, c]) => c), 1);

  const recent = [...employees].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard label="Total Employees" value={total} icon={Users} color="text-blue-600" bgColor="bg-blue-50" delay={0} />
        <StatsCard label="Active" value={active} icon={UserCheck} color="text-emerald-600" bgColor="bg-emerald-50" delay={50} />
        <StatsCard label="Inactive" value={inactive} icon={UserX} color="text-red-500" bgColor="bg-red-50" delay={100} />
        <StatsCard label="Departments" value={departments} icon={Building} color="text-amber-600" bgColor="bg-amber-50" delay={150} />
        <StatsCard label="Male" value={male} icon={UserCircle} color="text-cyan-600" bgColor="bg-cyan-50" delay={200} />
        <StatsCard label="Female" value={female} icon={Users2} color="text-pink-600" bgColor="bg-pink-50" delay={250} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">Employees by Department</h3>
          <p className="text-sm text-gray-500 mb-5">Distribution across all departments</p>
          <div className="space-y-3">
            {deptEntries.map(([dept, count]) => (
              <div key={dept}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept}</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">{count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(count / maxDept) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {deptEntries.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">Employee Status</h3>
          <p className="text-sm text-gray-500 mb-5">Active vs Inactive breakdown</p>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                {total > 0 && (
                  <>
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="14"
                      strokeDasharray={`${(active / total) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="14"
                      strokeDasharray={`${(inactive / total) * 251.2} 251.2`}
                      strokeDashoffset={`-${(active / total) * 251.2}`}
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{total}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">Active: <strong>{active}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-600">Inactive: <strong>{inactive}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Employees</h3>
            <p className="text-sm text-gray-500">Latest additions to the system</p>
          </div>
          <button
            onClick={() => onNavigate('employees')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 font-medium">Employee ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Department</th>
                <th className="pb-3 font-medium hidden md:table-cell">Designation</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 text-sm font-mono text-gray-600">{e.employee_id}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{e.full_name}</td>
                  <td className="py-3 text-sm text-gray-600 hidden sm:table-cell">{e.department}</td>
                  <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{e.designation}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      e.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-400">No employees yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Ready to add a new employee?</h3>
          <p className="text-sm text-blue-100 mt-1">Create a new employee record in just a few clicks</p>
        </div>
        <button
          onClick={() => onNavigate('add')}
          className="px-6 py-3 rounded-xl bg-white text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          + Add Employee
        </button>
      </div>
    </div>
  );
}
