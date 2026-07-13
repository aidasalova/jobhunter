import Link from 'next/link';
import { LayoutDashboard, FileText, Briefcase, User, Mail } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Master Profile', href: '/profile', icon: User },
  { name: 'CV Tailor', href: '/tailor', icon: FileText },
  { name: 'Tracker & Coach', href: '/tracker', icon: Briefcase },
  // { name: 'Job Radar', href: '/radar', icon: Radar },
];

export default function Sidebar() {
  return (
    <div className="fixed z-50 flex bg-slate-900 border-slate-800 text-slate-100 shadow-xl
      /* --- MOBILE: Bottom Bar --- */
      bottom-0 left-0 w-full h-16 flex-row border-t
      /* --- DESKTOP: Left Sidebar --- */
      lg:top-0 lg:left-0 lg:w-64 lg:h-screen lg:flex-col lg:border-t-0 lg:border-r">
      
      {/* Header - Hidden on Mobile */}
      <div className="hidden lg:flex h-16 shrink-0 items-center px-6 border-b border-slate-800/50 w-full">
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-sm">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          One More CV
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-row w-full justify-around items-center px-2
        lg:flex-col lg:justify-start lg:space-y-1 lg:px-4 lg:py-6 lg:items-stretch">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-white
              lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-2.5"
          >
            <item.icon className="h-5 w-5 lg:h-5 lg:w-5 shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-medium text-center leading-tight lg:text-sm lg:text-left">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer - Hidden on Mobile */}
      <div className="hidden lg:block mt-auto p-4 w-full">
        <div className="rounded-xl bg-slate-800 p-4 text-xs font-medium text-slate-400">
          <p className="mb-1 text-sm font-semibold text-slate-200">One More CV</p>
          <p className="leading-relaxed">Supercharge your job search with AI-powered CV tailoring and AI Interview Coach</p>
          <a 
            href="mailto:info@onemorecv.xyz?subject=OneMoreCV%20Info"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
        <div className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} One More CV. All rights reserved.
        </div>
      </div>
      
    </div>
  );
}