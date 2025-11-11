import { ReactNode } from 'react';
import {
  DashboardShell,
  DashboardNavItem,
  HomeIcon,
  ListIcon,
  UploadIcon,
  TemplateIcon,
  AcademicIcon,
  UserIcon,
  CurrencyIcon,
  SettingsIcon,
} from '@/components/layout/DashboardShell';

const navItems: DashboardNavItem[] = [
  { href: '/superadmin/dashboard', label: 'Overview', icon: HomeIcon },
  {
    href: '/superadmin/leads',
    label: 'Lead Console',
    icon: ListIcon,
    children: [
      { href: '/superadmin/leads/individual', label: 'Individual Lead', icon: UserIcon },
      { href: '/superadmin/leads/upload', label: 'Bulk Upload', icon: UploadIcon },
      { href: '/superadmin/leads/assign', label: 'Assign Leads', icon: UserIcon },
    ],
  },
  {
    href: '/superadmin/joining',
    label: 'Joining Desk',
    icon: AcademicIcon,
    children: [
      // { href: '/superadmin/joining', label: 'Pipeline', icon: ListIcon },
      { href: '/superadmin/joining/in-progress', label: 'In Progress', icon: AcademicIcon },
      { href: '/superadmin/joining/confirmed', label: 'Confirmed Leads', icon: ListIcon },
      { href: '/superadmin/joining/completed', label: 'Admissions', icon: AcademicIcon },
    ],
  },
  {
    href: '/superadmin/payments',
    label: 'Payments',
    icon: CurrencyIcon,
    children: [
      { href: '/superadmin/payments/courses', label: 'Courses & Branches', icon: ListIcon },
      { href: '/superadmin/payments/settings', label: 'Fee Configuration', icon: SettingsIcon },
      { href: '/superadmin/payments/transactions', label: 'Transactions', icon: TemplateIcon },
    ],
  },
  { href: '/superadmin/users', label: 'User Management', icon: UserIcon },
  { href: '/superadmin/communications/templates', label: 'SMS Templates', icon: TemplateIcon },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      title="Super Admin"
      description="Navigate admissions, communications, and lead workflows with ease."
      role="Super Admin"
      userName="Super Admin"
    >
      {children}
    </DashboardShell>
  );
}


