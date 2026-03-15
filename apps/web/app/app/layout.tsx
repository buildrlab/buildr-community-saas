import Link from 'next/link';
import { FolderOpen, Users } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-56 shrink-0 border-r border-brand-700/20 bg-white/60 backdrop-blur md:block">
        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-100"
          >
            <FolderOpen className="h-4 w-4" />
            Projects
          </Link>
          <Link
            href="/app/members"
            className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-100"
          >
            <Users className="h-4 w-4" />
            Members
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
