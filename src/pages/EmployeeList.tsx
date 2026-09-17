import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, UserPlus, Users } from 'lucide-react';
import { supabase, DEPARTMENTS, STATUSES, GENDERS, type Employee } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmployeeDetails from '@/components/EmployeeDetails';
import { useToast } from '@/components/Toast';

type SortField = 'full_name' | 'employee_id' | 'date_of_joining' | 'salary' | 'department';
type SortDir = 'asc' | 'desc';

interface EmployeeListProps {
  onEdit: (emp: Employee) => void;
  onAdd: () => void;
  refreshKey: number;
}

const PAGE_SIZE = 8;

export default function EmployeeList({ onEdit, onAdd, refreshKey }: EmployeeListProps) {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('date_of_joining');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) {
      showToast('Unable to load employees. Please try again.', 'error');
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    let result = [...employees];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.employee_id.toLowerCase().includes(q) ||
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
      );
    }

    if (deptFilter) result = result.filter((e) => e.department === deptFilter);
    if (statusFilter) result = result.filter((e) => e.status === statusFilter);
    if (genderFilter) result = result.filter((e) => e.gender === genderFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'salary') cmp = a.salary - b.salary;
      else if (sortField === 'date_of_joining') cmp = new Date(a.date_of_joining).getTime() - new Date(b.date_of_joining).getTime();
      else cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [employees, search, deptFilter, statusFilter, genderFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('employees').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      showToast('Failed to delete employee. Please try again.', 'error');
    } else {
      showToast('Employee deleted successfully.', 'success');
      setDeleteTarget(null);
      fetchEmployees();
    }
  };

  const sortIcon = (field: SortField) => (
    <ArrowUpDown
      className={`w-3.5 h-3.5 inline ml-1 transition-colors ${sortField === field ? 'text-blue-600' : 'text-gray-300'}`}
    />
  );

  if (loading) return <LoadingSpinner text="Loading employees..." />;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, name, email, department, designation..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">All Genders</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <button
              onClick={onAdd}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Employee</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-100">
                <th className="px-5 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort('employee_id')}>
                  Emp ID {sortIcon('employee_id')}
                </th>
                <th className="px-5 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort('full_name')}>
                  Name {sortIcon('full_name')}
                </th>
                <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Email</th>
                <th className="px-5 py-3.5 font-medium hidden md:table-cell">Phone</th>
                <th className="px-5 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort('department')}>
                  Department {sortIcon('department')}
                </th>
                <th className="px-5 py-3.5 font-medium hidden xl:table-cell">Designation</th>
                <th className="px-5 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort('date_of_joining')}>
                  Joined {sortIcon('date_of_joining')}
                </th>
                <th className="px-5 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort('salary')}>
                  Salary {sortIcon('salary')}
                </th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageItems.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{e.employee_id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {e.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{e.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden lg:table-cell">{e.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden md:table-cell">{e.phone}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{e.department}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden xl:table-cell">{e.designation}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{e.date_of_joining}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900 tabular-nums">&#8377;{Number(e.salary).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      e.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewTarget(e)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(e)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(e)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">No employees found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong>–<strong>{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.full_name} (${deleteTarget?.employee_id})? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <EmployeeDetails
        employee={viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={(e) => { setViewTarget(null); onEdit(e); }}
      />
    </div>
  );
}
