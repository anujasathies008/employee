import { Building2, Users, Search, Filter, BarChart3, FileBarChart, Shield, Database, Server, Code, CheckCircle } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Users, label: 'Employee CRUD', desc: 'Create, read, update, and delete employee records' },
    { icon: Search, label: 'Search', desc: 'Search by employee ID, name, email, department, or designation' },
    { icon: Filter, label: 'Filtering', desc: 'Filter by department, status, and gender simultaneously' },
    { icon: BarChart3, label: 'Dashboard', desc: 'Real-time statistics and visual analytics' },
    { icon: FileBarChart, label: 'Reports', desc: 'Department-wise breakdowns and CSV export' },
    { icon: Shield, label: 'Validation', desc: 'Frontend and backend validation for all inputs' },
  ];

  const stack = [
    { icon: Code, label: 'React + TypeScript', desc: 'Frontend SPA with Tailwind CSS' },
    { icon: Server, label: 'Supabase', desc: 'PostgreSQL database with REST API' },
    { icon: Database, label: 'PostgreSQL', desc: 'Relational database with RLS policies' },
  ];

  const flow = [
    'User enters employee details',
    'Frontend validation',
    'Supabase REST API',
    'Database validation',
    'Record persisted in PostgreSQL',
    'Success response to UI',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Employee Management System</h2>
            <p className="text-sm text-slate-400">College Project Demonstration</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          A web-based system for managing employee records efficiently. The application provides a complete
          CRUD interface with search, filtering, sorting, dashboard analytics, and reporting capabilities.
          All data is persisted in a PostgreSQL database via Supabase REST APIs.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Technology Stack</h3>
        <div className="space-y-3">
          {stack.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">CRUD Workflow</h3>
        <div className="space-y-2">
          {flow.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-gray-700">{step}</span>
              {i < flow.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <CheckCircle className="w-4 h-4" />
          Data persists across browser refreshes — stored in PostgreSQL
        </div>
      </div>
    </div>
  );
}
