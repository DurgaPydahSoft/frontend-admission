import { ReactNode } from 'react';
import { DashboardShell, DashboardNavItem, HomeIcon, ListIcon } from '@/components/layout/DashboardShell';

const navItems: DashboardNavItem[] = [
  { href: '/user/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/user/leads', label: 'My Leads', icon: ListIcon },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      title="Admissions Team"
      description="Stay on top of your leads, follow-ups, and conversions."
      role="Counsellor"
      userName="Team Member"
    >
      {children}
    </DashboardShell>
  );
}


