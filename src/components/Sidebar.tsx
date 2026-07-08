import Link from 'next/link';
import { LayoutDashboard, FileText, Briefcase, User } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Master Profile', href: '/profile', icon: User },
  { name: 'CV Tailor', href: '/tailor', icon: FileText },
  { name: 'Application Tracker', href: '/tracker', icon: Briefcase },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 text-slate-100 shadow-xl">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800/50">
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-sm">
             <Briefcase className="h-5 w-5 text-white" />
          </div>
          JobHunter
        </div>
      </div>
      <nav className="flex flex-1 flex-col space-y-1 px-4 py-6">
        {navigation.map((item) => {
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-xl bg-slate-800 p-4 text-xs font-medium text-slate-400">
          <p className="mb-1 text-sm font-semibold text-slate-200">JobHunter Pro</p>
          <p className="leading-relaxed">Supercharge your job search with AI-powered CV tailoring.</p>
        </div>
      </div>
    </div>
  );
}
