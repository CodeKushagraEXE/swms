import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { useState } from 'react';

const steps = [
  {
    step: '1',
    title: 'Sign in & explore',
    body: 'Use your role-based account (Admin, Manager, or Employee). Managers and admins see all assigned projects; employees see projects they belong to.',
  },
  {
    step: '2',
    title: 'Manage projects',
    body: 'Create projects, add team members, and track progress from the Projects page. Each project has its own activity timeline.',
  },
  {
    step: '3',
    title: 'Work on the Kanban board',
    body: 'Drag tasks between To Do, In Progress, and Done. Blocked tasks show when dependencies are not complete.',
  },
  {
    step: '4',
    title: 'Collaborate in real time',
    body: 'Open the Kanban board in two tabs to see live updates when teammates move or edit tasks.',
  },
];

const benefits = [
  { icon: '📋', title: 'Centralized tasks', desc: 'One place for assignments, priorities, due dates, and status across every project.' },
  { icon: '🔗', title: 'Smart dependencies', desc: 'Link tasks so work cannot start until prerequisites are done — no more surprise blockers.' },
  { icon: '⚡', title: 'Live updates', desc: 'WebSocket-powered Kanban keeps every teammate on the same page without refreshing.' },
  { icon: '🔐', title: 'Role-based access', desc: 'Admins, managers, and employees each see what they need with secure JWT authentication.' },
];

const faqs = [
  {
    q: 'Who can create projects?',
    a: 'Any authenticated user can create a project. The creator becomes the project owner. Owners and admins can add or remove members.',
  },
  {
    q: 'Why can’t I move a task to In Progress?',
    a: 'Tasks with unfinished dependencies are blocked. Complete or remove the dependency first, then try again.',
  },
  {
    q: 'What do the dashboard numbers mean?',
    a: 'The dashboard summarizes projects you can access, total tasks, and breakdowns by status, plus per-project completion percentages.',
  },
  {
    q: 'How do I assign work to someone?',
    a: 'Open a task from the Kanban board or project view, pick an assignee from your team, and save. Activity logs record the change.',
  },
  {
    q: 'Is my data saved?',
    a: 'Yes. All changes persist to the database immediately. In demo mode, data resets when the server restarts.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{q}</span>
        <span className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          {a}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const user = useAppSelector(s => s.auth.user);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 md:p-10 shadow-lg">
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Smart Workflow Management System</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Plan, track, and ship work — together</h1>
          <p className="mt-4 text-blue-100 max-w-2xl text-lg leading-relaxed">
            SWMS helps teams run projects with Kanban boards, task dependencies, real-time collaboration,
            and a clear audit trail — built for managers who need visibility and teams who need focus.
          </p>
          {user && (
            <p className="mt-4 text-blue-200 text-sm">
              Signed in as <span className="text-white font-semibold">{user.name}</span> ({user.role})
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors shadow">
              Open Dashboard →
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 border border-white/30 transition-colors">
              View Projects
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What is SWMS?</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          SWMS is a full-stack workflow application for project and task management. It combines a visual
          Kanban board, dependency-aware scheduling, role-based security, and live updates so distributed
          teams can coordinate delivery without spreadsheets or scattered chat threads.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why use it?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {benefits.map(b => (
            <div key={b.title} className="card p-5">
              <span className="text-2xl">{b.icon}</span>
              <h3 className="font-semibold mt-2 text-gray-900 dark:text-white">{b.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to use it</h2>
        <ol className="space-y-4">
          {steps.map(s => (
            <li key={s.step} className="flex gap-4 card p-4">
              <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map(f => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
