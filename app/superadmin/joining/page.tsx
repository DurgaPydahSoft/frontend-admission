'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { leadAPI } from '@/lib/api';
import { Lead } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDashboardHeader } from '@/components/layout/DashboardShell';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  interested: 'bg-green-100 text-green-700',
  contacted: 'bg-sky-100 text-sky-700',
  qualified: 'bg-indigo-100 text-indigo-700',
  'not interested': 'bg-red-100 text-red-700',
  partial: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-purple-100 text-purple-700',
  admitted: 'bg-emerald-100 text-emerald-700',
};

const getStatusBadge = (status?: string) => {
  if (!status) return 'bg-slate-100 text-slate-600';
  const key = status.toLowerCase();
  return statusColors[key] || 'bg-slate-100 text-slate-600';
};

const JoiningPipelinePage = () => {
  const { setHeaderContent, clearHeaderContent } = useDashboardHeader();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['joining-pipeline', page, limit, searchTerm],
    queryFn: async () => {
      const response = await leadAPI.getAll({
        page,
        limit,
        search: searchTerm || undefined,
        leadStatus: 'Confirmed',
      });
      return response.data || response;
    },
    placeholderData: (previousData) => previousData,
  });

  const leads = (data?.leads ?? []) as Lead[];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0, limit };
  const isEmpty = !isLoading && leads.length === 0;

  const headerContent = useMemo(
    () => (
      <div className="flex flex-col items-end gap-2 text-right">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Joining Pipeline</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Confirmed leads awaiting joining forms. Launch the form when the student is ready.
        </p>
      </div>
    ),
    []
  );

  useEffect(() => {
    setHeaderContent(headerContent);
    return () => clearHeaderContent();
  }, [headerContent, setHeaderContent, clearHeaderContent]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search confirmed leads by name, phone, or enquiry number…"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total confirmed leads: <span className="font-semibold text-blue-600 dark:text-blue-300">{pagination.total}</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border border-white/60 shadow-lg shadow-blue-100/30 dark:border-slate-800/70 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
            <thead className="bg-slate-50/80 backdrop-blur-sm dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Course Interest
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Quota
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mandal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/80 backdrop-blur-sm dark:divide-slate-800 dark:bg-slate-900/60">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-500">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
                    <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Loading confirmed leads…</p>
                  </td>
                </tr>
              ) : isEmpty ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-500">
                    <p className="font-medium text-slate-600 dark:text-slate-400">No confirmed leads available.</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                      Update a lead to “Confirmed” from the Lead Console to begin the joining journey.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="transition hover:bg-blue-50/60 dark:hover:bg-slate-800/60">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{lead.name}</span>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          {lead.enquiryNumber && <span className="rounded-full bg-slate-100 px-2 py-0.5">{lead.enquiryNumber}</span>}
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(lead.leadStatus)}`}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            {lead.leadStatus || 'New'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span>{lead.phone}</span>
                        {lead.fatherPhone && <span className="text-xs text-slate-400">Father: {lead.fatherPhone}</span>}
                        {lead.email && <span className="text-xs text-slate-400">{lead.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span>{lead.courseInterested || 'Course not set'}</span>
                        {lead.interCollege && <span className="text-xs text-slate-400">{lead.interCollege}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.quota || 'Not Applicable'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span>{lead.mandal}</span>
                        <span className="text-xs text-slate-400">{lead.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(lead.updatedAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/superadmin/joining/${lead._id}`}>
                        <Button variant="primary" className="group inline-flex items-center gap-2">
                          <span className="transition-transform group-hover:-translate-x-0.5">Add Joining Form</span>
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= pagination.pages || isFetching}
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default JoiningPipelinePage;


