'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { leadAPI } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/lib/toast';
import { useDashboardHeader } from '@/components/layout/DashboardShell';
import { FilterOptions } from '@/types';

interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  hallTicketNumber: string;
  village: string;
  district: string;
  mandal: string;
  state: string;
  quota: string;
  courseInterested: string;
  applicationStatus: string;
  gender: string;
  interCollege: string;
}

const initialFormState: LeadFormState = {
  name: '',
  phone: '',
  email: '',
  fatherName: '',
  fatherPhone: '',
  motherName: '',
  hallTicketNumber: '',
  village: '',
  district: '',
  mandal: '',
  state: 'Andhra Pradesh',
  quota: 'Not Applicable',
  courseInterested: '',
  applicationStatus: 'Not Provided',
  gender: 'Not Specified',
  interCollege: '',
};

const requiredFields: Array<keyof LeadFormState> = [
  'name',
  'phone',
  'fatherName',
  'fatherPhone',
  'village',
  'district',
  'mandal',
];

const IndividualLeadPage = () => {
  const router = useRouter();
  const { setHeaderContent, clearHeaderContent } = useDashboardHeader();
  const [formState, setFormState] = useState<LeadFormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: filterOptionsData, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['lead-filter-options'],
    queryFn: async () => {
      const response = await leadAPI.getFilterOptions();
      return response.data || response;
    },
    staleTime: 300000,
  });

  const filterOptions = (filterOptionsData?.data || filterOptionsData) as FilterOptions | undefined;

  const headerContent = useMemo(
    () => (
      <div className="flex flex-col items-end gap-2 text-right">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create Individual Lead</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture a single prospect manually and slot them straight into your admissions workflow.
        </p>
      </div>
    ),
    []
  );

  useEffect(() => {
    setHeaderContent(headerContent);
    return () => clearHeaderContent();
  }, [headerContent, setHeaderContent, clearHeaderContent]);

  const createLeadMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formState,
        hallTicketNumber: formState.hallTicketNumber || undefined,
        email: formState.email || undefined,
        motherName: formState.motherName || undefined,
        courseInterested: formState.courseInterested || undefined,
        interCollege: formState.interCollege || undefined,
      };
      return leadAPI.create(payload);
    },
    onSuccess: (data: any) => {
      showToast.success('Lead created successfully');
      setFormState(initialFormState);
      setErrors({});
      const leadId = data?.data?._id || data?._id;
      if (leadId) {
        router.push(`/superadmin/leads/${leadId}`);
      } else {
        router.push('/superadmin/leads');
      }
    },
    onError: (error: any) => {
      showToast.error(error.response?.data?.message || 'Unable to create lead');
    },
  });

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!formState[field]?.trim()) {
        nextErrors[field] = 'Required';
      }
    });
    if (formState.phone && formState.phone.length < 10) {
      nextErrors.phone = 'Enter a valid phone number';
    }
    if (formState.fatherPhone && formState.fatherPhone.length < 10) {
      nextErrors.fatherPhone = 'Enter a valid phone number';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof LeadFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    createLeadMutation.mutate();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card className="p-6 shadow-lg shadow-blue-100/40 dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Student Name *"
              name="name"
              value={formState.name}
              onChange={handleChange('name')}
              error={errors.name}
              placeholder="Enter full name"
            />
            <Input
              label="Primary Phone *"
              name="phone"
              value={formState.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              placeholder="10 digit mobile number"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange('email')}
              placeholder="student@email.com"
            />
            <Input
              label="Hall Ticket Number"
              name="hallTicketNumber"
              value={formState.hallTicketNumber}
              onChange={handleChange('hallTicketNumber')}
              placeholder="Optional"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Father's Name *"
              name="fatherName"
              value={formState.fatherName}
              onChange={handleChange('fatherName')}
              error={errors.fatherName}
            />
            <Input
              label="Father's Phone *"
              name="fatherPhone"
              value={formState.fatherPhone}
              onChange={handleChange('fatherPhone')}
              error={errors.fatherPhone}
            />
            <Input
              label="Mother's Name"
              name="motherName"
              value={formState.motherName}
              onChange={handleChange('motherName')}
            />
            <Input
              label="Intermediate / Diploma College"
              name="interCollege"
              value={formState.interCollege}
              onChange={handleChange('interCollege')}
              placeholder="Where did the student study last?"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Village / City *"
              name="village"
              value={formState.village}
              onChange={handleChange('village')}
              error={errors.village}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">District *</label>
              <select
                name="district"
                value={formState.district}
                onChange={handleChange('district')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="">Select district</option>
                {filterOptions?.districts?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">Mandal *</label>
              <select
                name="mandal"
                value={formState.mandal}
                onChange={handleChange('mandal')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="">Select mandal</option>
                {filterOptions?.mandals?.map((mandal) => (
                  <option key={mandal} value={mandal}>
                    {mandal}
                  </option>
                ))}
              </select>
              {errors.mandal && <p className="mt-1 text-sm text-red-600">{errors.mandal}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">State *</label>
              <select
                name="state"
                value={formState.state}
                onChange={handleChange('state')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {filterOptions?.states?.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                )) || <option value="Andhra Pradesh">Andhra Pradesh</option>}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">Quota *</label>
              <select
                name="quota"
                value={formState.quota}
                onChange={handleChange('quota')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {(filterOptions?.quotas || ['Not Applicable', 'Management', 'Convenor']).map((quota) => (
                  <option key={quota} value={quota}>
                    {quota}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                label="Programme Interest"
                name="courseInterested"
                value={formState.courseInterested}
                onChange={handleChange('courseInterested')}
                placeholder="Programme / Branch"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">Gender</label>
              <select
                name="gender"
                value={formState.gender}
                onChange={handleChange('gender')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {['Not Specified', 'Male', 'Female', 'Other'].map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">Application Status</label>
              <select
                name="applicationStatus"
                value={formState.applicationStatus}
                onChange={handleChange('applicationStatus')}
                className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {(filterOptions?.applicationStatuses || ['Not Provided', 'Submitted', 'Not Submitted']).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fields marked with * are mandatory. Ensure contact numbers are reachable before saving.
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormState(initialFormState);
                  setErrors({});
                }}
                disabled={createLeadMutation.isPending}
              >
                Reset
              </Button>
              <Button type="submit" variant="primary" disabled={createLeadMutation.isPending || isLoadingFilters}>
                {createLeadMutation.isPending ? 'Saving…' : 'Create Lead'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default IndividualLeadPage;
