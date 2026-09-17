import { useState } from 'react';
import Sidebar, { type PageId } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ToastProvider } from '@/components/Toast';
import Dashboard from '@/pages/Dashboard';
import EmployeeList from '@/pages/EmployeeList';
import AddEmployee from '@/pages/AddEmployee';
import EditEmployee from '@/pages/EditEmployee';
import Reports from '@/pages/Reports';
import About from '@/pages/About';
import type { Employee } from '@/lib/supabase';

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of employee statistics and analytics' },
  employees: { title: 'Employees', subtitle: 'Manage all employee records' },
  add: { title: 'Add Employee', subtitle: 'Create a new employee record' },
  reports: { title: 'Reports', subtitle: 'Analytics and data export' },
  about: { title: 'About', subtitle: 'About this application' },
};

function AppContent() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigate = (p: PageId) => {
    if (p === 'add') setEditTarget(null);
    setPage(p);
  };

  const handleEdit = (emp: Employee) => {
    setEditTarget(emp);
    setPage('add');
  };

  const handleAddDone = () => {
    setEditTarget(null);
    setRefreshKey((k) => k + 1);
    setPage('employees');
  };

  const meta = pageMeta[page];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        current={page}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <main className="flex-1 p-4 lg:p-8">
          {page === 'dashboard' && <Dashboard onNavigate={(p) => handleNavigate(p as PageId)} />}
          {page === 'employees' && (
            <EmployeeList onEdit={handleEdit} onAdd={() => handleNavigate('add')} refreshKey={refreshKey} />
          )}
          {page === 'add' && !editTarget && <AddEmployee onDone={handleAddDone} />}
          {page === 'add' && editTarget && (
            <EditEmployee employee={editTarget} onDone={handleAddDone} />
          )}
          {page === 'reports' && <Reports />}
          {page === 'about' && <About />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
