'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/auth';
import { communicationAPI, leadAPI } from '@/lib/api';
import { Lead, MessageTemplate, MessageTemplateVariable } from '@/types';
import { useModulePermission } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/lib/toast';

const VAR_REGEX = /\{#var#\}/gi;

type TemplateFormState = {
  name: string;
  dltTemplateId: string;
  language: string;
  content: string;
  description: string;
  isUnicode: boolean;
  variables: MessageTemplateVariable[];
};

const DEFAULT_FORM_STATE: TemplateFormState = {
  name: '',
  dltTemplateId: '',
  language: 'en',
  content: '',
  description: '',
  isUnicode: false,
  variables: [],
};

const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
];

const ensureVariableArray = (content: string, existing?: MessageTemplateVariable[]) => {
  const matches = content.match(VAR_REGEX);
  const count = matches ? matches.length : 0;

  if (count === 0) {
    return [];
  }

  const normalized: MessageTemplateVariable[] = [];

  for (let index = 0; index < count; index += 1) {
    const fallbackKey = `var${index + 1}`;
    const existingVar = existing?.[index];
    normalized.push({
      key: existingVar?.key || fallbackKey,
      label: existingVar?.label || (index === 0 ? 'Lead Name' : `Variable ${index + 1}`),
      defaultValue: existingVar?.defaultValue || '',
    });
  }

  return normalized;
};

const TemplateModal = ({
  mode,
  onClose,
  onSubmit,
  initialData,
  isProcessing,
}: {
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (state: TemplateFormState) => void;
  initialData?: MessageTemplate;
  isProcessing: boolean;
}) => {
  const [formState, setFormState] = useState<TemplateFormState>(() => {
    if (initialData) {
      return {
        name: initialData.name,
        dltTemplateId: initialData.dltTemplateId,
        language: initialData.language || 'en',
        content: initialData.content,
        description: initialData.description || '',
        isUnicode: Boolean(initialData.isUnicode || initialData.language !== 'en'),
        variables: ensureVariableArray(initialData.content, initialData.variables),
      };
    }
    return {
      ...DEFAULT_FORM_STATE,
      variables: ensureVariableArray('', []),
    };
  });

  const variableCount = useMemo(() => {
    const matches = formState.content.match(VAR_REGEX);
    return matches ? matches.length : 0;
  }, [formState.content]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      variables: ensureVariableArray(prev.content, prev.variables),
    }));
    // Only adjust when content changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.content]);

  const handleVariableChange = (index: number, key: keyof MessageTemplateVariable, value: string) => {
    setFormState((prev) => {
      const nextVariables = [...prev.variables];
      nextVariables[index] = {
        ...nextVariables[index],
        [key]: value,
      };
      return {
        ...prev,
        variables: nextVariables,
      };
    });
  };

  const handleSubmit = () => {
    if (!formState.name.trim()) {
      showToast.error('Template name is required');
      return;
    }
    if (!formState.dltTemplateId.trim()) {
      showToast.error('DLT Template ID is required');
      return;
    }
    if (!formState.content.trim()) {
      showToast.error('Template content is required');
      return;
    }

    onSubmit({
      ...formState,
      language: formState.language || 'en',
      variables: ensureVariableArray(formState.content, formState.variables),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {mode === 'create' ? 'Create Template' : 'Edit Template'}
            </h2>
            <p className="text-sm text-gray-500">
              Configure template details and map placeholders to friendly labels.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <Input
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Counselling started for Degree"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DLT Template ID</label>
            <Input
              value={formState.dltTemplateId}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, dltTemplateId: e.target.value }))
              }
              placeholder="1607100000000129152"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
              value={formState.language}
              onChange={(e) => {
                const language = e.target.value;
                setFormState((prev) => ({
                  ...prev,
                  language,
                  isUnicode: language !== 'en' ? true : prev.isUnicode,
                }));
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-8">
            <input
              id="unicode-toggle"
              type="checkbox"
              checked={formState.isUnicode}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, isUnicode: e.target.checked }))
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="unicode-toggle" className="text-sm text-gray-700">
              Unicode (non-English) message
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Input
            value={formState.description}
            onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Short summary for internal reference"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Content
          </label>
          <textarea
            className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
            value={formState.content}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            placeholder="Use {#var#} for placeholder values"
          />
          <p className="text-xs text-gray-500 mt-1">
            Detected placeholders: <span className="font-semibold">{variableCount}</span>
          </p>
        </div>

        {variableCount > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Placeholder Mapping</h3>
            <div className="space-y-3">
              {formState.variables.map((variable, index) => (
                <div
                  key={variable.key || `var-${index}`}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Placeholder
                    </label>
                    <Input
                      value={variable.key}
                      onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                      placeholder={`var${index + 1}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Friendly Label
                    </label>
                    <Input
                      value={variable.label}
                      onChange={(e) => handleVariableChange(index, 'label', e.target.value)}
                      placeholder={index === 0 ? 'Lead Name' : `Variable ${index + 1}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Default Value
                    </label>
                    <Input
                      value={variable.defaultValue || ''}
                      onChange={(e) =>
                        handleVariableChange(index, 'defaultValue', e.target.value)
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? 'Saving…' : mode === 'create' ? 'Create Template' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const TemplatesSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={`template-skel-${index}`} className="w-full h-14" />
    ))}
  </div>
);

const MAX_BULK_LEADS = 80;

function buildSmsVariablesForLead(lead: Lead, template: MessageTemplate): { key: string; value: string }[] {
  const vars = template.variables && template.variables.length > 0 ? template.variables : [];
  if (vars.length === 0) {
    const n = template.variableCount || 0;
    return Array.from({ length: n }).map((_, index) => ({
      key: `var${index + 1}`,
      value: index === 0 ? (lead.name || '').trim() : '',
    }));
  }
  return vars.map((variable, index) => {
    const key = variable.key || `var${index + 1}`;
    let value = (variable.defaultValue || '').trim();
    if (index === 0 && lead.name) {
      value = lead.name.trim();
    }
    return { key, value };
  });
}

function SendToLeadsTab() {
  const { canWrite } = useModulePermission('communications');
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;
  const [selectedById, setSelectedById] = useState<Record<string, Lead>>({});
  const [templateId, setTemplateId] = useState('');
  const [sendPrimary, setSendPrimary] = useState(true);
  const [sendFather, setSendFather] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: templatesData, isLoading: loadingTemplates } = useQuery({
    queryKey: ['activeTemplates', 'communications-broadcast'],
    queryFn: async () => {
      const response = await communicationAPI.getActiveTemplates();
      const payload = (response as { data?: MessageTemplate[] })?.data ?? response;
      return Array.isArray(payload) ? payload : [];
    },
  });
  const activeTemplates: MessageTemplate[] = Array.isArray(templatesData) ? templatesData : [];

  const selectedTemplate = useMemo(
    () => activeTemplates.find((t) => t._id === templateId),
    [activeTemplates, templateId]
  );

  const { data: leadsPayload, isLoading: loadingLeads } = useQuery({
    queryKey: ['broadcastLeads', page, limit, debouncedSearch],
    queryFn: async () => {
      return await leadAPI.getAll({ page, limit, search: debouncedSearch || undefined });
    },
  });

  const leads: Lead[] = leadsPayload?.leads ?? [];
  const pagination = leadsPayload?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    pages: 1,
  };

  const selectedCount = Object.keys(selectedById).length;

  const leadHasRecipient = useCallback(
    (lead: Lead) =>
      Boolean(
        (sendPrimary && lead.phone && String(lead.phone).replace(/\D/g, '').length >= 10) ||
          (sendFather && lead.fatherPhone && String(lead.fatherPhone).replace(/\D/g, '').length >= 10)
      ),
    [sendFather, sendPrimary]
  );

  const toggleLead = useCallback((lead: Lead) => {
    if (!leadHasRecipient(lead)) {
      showToast.error('This lead has no phone for the selected recipient types.');
      return;
    }
    setSelectedById((prev) => {
      const next = { ...prev };
      if (next[lead._id]) {
        delete next[lead._id];
      } else {
        if (Object.keys(next).length >= MAX_BULK_LEADS) {
          showToast.error(`You can select at most ${MAX_BULK_LEADS} leads per batch.`);
          return prev;
        }
        next[lead._id] = lead;
      }
      return next;
    });
  }, [leadHasRecipient]);

  const selectEligibleOnPage = useCallback(() => {
    setSelectedById((prev) => {
      const next = { ...prev };
      let count = Object.keys(next).length;
      for (const l of leads) {
        if (!leadHasRecipient(l)) continue;
        if (next[l._id]) continue;
        if (count >= MAX_BULK_LEADS) {
          showToast.error(`Maximum ${MAX_BULK_LEADS} leads per batch.`);
          break;
        }
        next[l._id] = l;
        count += 1;
      }
      return next;
    });
  }, [leadHasRecipient, leads]);

  const clearSelection = useCallback(() => setSelectedById({}), []);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTemplate) throw new Error('Select a message template.');
      const list = Object.values(selectedById);
      if (list.length === 0) throw new Error('Select at least one lead.');
      let ok = 0;
      let fail = 0;
      for (const lead of list) {
        const numbers: string[] = [];
        if (sendPrimary && lead.phone) numbers.push(lead.phone);
        if (sendFather && lead.fatherPhone) numbers.push(lead.fatherPhone);
        const uniq = [...new Set(numbers.map((n) => String(n).trim()).filter(Boolean))];
        if (uniq.length === 0) {
          fail += 1;
          continue;
        }
        try {
          const variables = buildSmsVariablesForLead(lead, selectedTemplate);
          await communicationAPI.sendSms(lead._id, {
            contactNumbers: uniq,
            templates: [{ templateId: selectedTemplate._id, variables }],
          });
          ok += 1;
        } catch {
          fail += 1;
        }
      }
      return { ok, fail };
    },
    onSuccess: ({ ok, fail }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (fail === 0) {
        showToast.success(`SMS sent for ${ok} lead(s).`);
      } else {
        showToast.success(`Sent for ${ok} lead(s); ${fail} skipped or failed.`);
      }
      clearSelection();
    },
    onError: (e: Error) => {
      showToast.error(e?.message || 'Failed to send');
    },
  });

  const canSend =
    canWrite &&
    Boolean(templateId) &&
    selectedCount > 0 &&
    (sendPrimary || sendFather) &&
    Boolean(selectedTemplate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Message template</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pick the DLT template to send. The first template variable is filled with each lead&apos;s name (same
            behaviour as on a lead&apos;s SMS panel).
          </p>
          {loadingTemplates ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="">Select a template…</option>
              {activeTemplates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({(t.language || 'en').toUpperCase()})
                </option>
              ))}
            </select>
          )}
        </Card>
        <Card className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recipients</h2>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={sendPrimary}
              onChange={(e) => setSendPrimary(e.target.checked)}
            />
            Student / primary mobile
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={sendFather}
              onChange={(e) => setSendFather(e.target.checked)}
            />
            Father mobile
          </label>
          {!sendPrimary && !sendFather && (
            <p className="text-sm text-amber-700 dark:text-amber-300">Select at least one recipient type.</p>
          )}
        </Card>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search leads</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, phone, enquiry number…"
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button variant="secondary" size="sm" type="button" onClick={selectEligibleOnPage} disabled={loadingLeads}>
              Select eligible on page
            </Button>
            <Button variant="secondary" size="sm" type="button" onClick={clearSelection} disabled={selectedCount === 0}>
              Clear selection ({selectedCount})
            </Button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {selectedCount} selected (max {MAX_BULK_LEADS} per batch). Showing page {pagination.page} of{' '}
          {pagination.pages} — {pagination.total} leads total.
        </p>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/60">
              <tr>
                <th className="w-10 px-3 py-2 text-left" />
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-slate-400">Lead</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-slate-400">Phone</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-slate-400">District</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-white/60 dark:bg-slate-900/40">
              {loadingLeads ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6">
                    <TemplatesSkeleton />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    No leads match this search.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const eligible = leadHasRecipient(lead);
                  const checked = Boolean(selectedById[lead._id]);
                  return (
                    <tr key={lead._id} className={!eligible ? 'opacity-50' : undefined}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={checked}
                          disabled={!eligible}
                          onChange={() => toggleLead(lead)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300 font-mono text-xs">{lead.phone || '—'}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{lead.district || '—'}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{lead.leadStatus || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                disabled={page <= 1 || loadingLeads}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                disabled={page >= pagination.pages || loadingLeads}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          {!canWrite && (
            <p className="text-sm text-amber-700 dark:text-amber-300">You do not have permission to send SMS.</p>
          )}
          <Button
            variant="primary"
            type="button"
            className="sm:ml-auto"
            disabled={!canSend || sendMutation.isPending}
            onClick={() => {
              if (!window.confirm(`Send this template to ${selectedCount} lead(s)?`)) return;
              sendMutation.mutate();
            }}
          >
            {sendMutation.isPending ? 'Sending…' : `Send SMS to ${selectedCount} lead(s)`}
          </Button>
        </div>
      </Card>
    </div>
  );
}

type CommunicationsTab = 'templates' | 'send';

export default function TemplatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(auth.getUser());
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | undefined>();
  const [activeTab, setActiveTab] = useState<CommunicationsTab>('templates');

  useEffect(() => {
    setIsMounted(true);
    const currentUser = auth.getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    if (currentUser.roleName !== 'Super Admin' && currentUser.roleName !== 'Sub Super Admin') {
      router.push('/user/dashboard');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const canDeactivateTemplates = user?.roleName === 'Super Admin';

  const {
    data: templatesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['communicationTemplates', languageFilter, showInactive, search],
    queryFn: async () => {
      const response = await communicationAPI.getTemplates({
        language: languageFilter === 'all' ? undefined : languageFilter,
        isActive: showInactive ? undefined : true,
        search: search.trim() || undefined,
      });
      return response?.data ?? [];
    },
    enabled: isMounted && Boolean(user),
  });

  const templates: MessageTemplate[] = Array.isArray(templatesResponse)
    ? templatesResponse
    : [];

  const createMutation = useMutation({
    mutationFn: (payload: TemplateFormState) =>
      communicationAPI.createTemplate({
        name: payload.name.trim(),
        dltTemplateId: payload.dltTemplateId.trim(),
        language: payload.language,
        content: payload.content,
        description: payload.description,
        isUnicode: payload.isUnicode,
        variables: payload.variables,
      }),
    onSuccess: () => {
      showToast.success('Template created successfully');
      queryClient.invalidateQueries({ queryKey: ['communicationTemplates'] });
      setModalMode(null);
      setEditingTemplate(undefined);
    },
    onError: (error: any) => {
      console.error('Error creating template:', error);
      showToast.error(error.response?.data?.message || 'Failed to create template');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TemplateFormState }) =>
      communicationAPI.updateTemplate(id, {
        name: payload.name.trim(),
        dltTemplateId: payload.dltTemplateId.trim(),
        language: payload.language,
        content: payload.content,
        description: payload.description,
        isUnicode: payload.isUnicode,
        variables: payload.variables,
      }),
    onSuccess: () => {
      showToast.success('Template updated successfully');
      queryClient.invalidateQueries({ queryKey: ['communicationTemplates'] });
      setModalMode(null);
      setEditingTemplate(undefined);
    },
    onError: (error: any) => {
      console.error('Error updating template:', error);
      showToast.error(error.response?.data?.message || 'Failed to update template');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => communicationAPI.deleteTemplate(id),
    onSuccess: () => {
      showToast.success('Template deactivated');
      queryClient.invalidateQueries({ queryKey: ['communicationTemplates'] });
    },
    onError: (error: any) => {
      console.error('Error deleting template:', error);
      showToast.error(error.response?.data?.message || 'Failed to delete template');
    },
  });

  const handleAddTemplate = () => {
    setModalMode('create');
    setEditingTemplate(undefined);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setModalMode('edit');
  };

  const handleModalSubmit = (formData: TemplateFormState) => {
    if (modalMode === 'create') {
      createMutation.mutate(formData);
    } else if (modalMode === 'edit' && editingTemplate) {
      updateMutation.mutate({ id: editingTemplate._id, payload: formData });
    }
  };

  const activeCount = templates.filter((template) => template.isActive).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Communications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage SMS templates and send a template to multiple leads.
          </p>
        </div>
        <nav
          className="flex w-full shrink-0 flex-wrap justify-end gap-1 self-end rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/80 sm:w-auto"
          aria-label="Communications sections"
        >
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'templates'
                ? 'bg-white text-[#c2410c] shadow-sm dark:bg-slate-900 dark:text-[#fb923c]'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Message templates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('send')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'send'
                ? 'bg-white text-[#c2410c] shadow-sm dark:bg-slate-900 dark:text-[#fb923c]'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Send to leads
          </button>
        </nav>
      </header>

      {activeTab === 'send' ? (
        <SendToLeadsTab />
      ) : null}

      {activeTab === 'templates' ? (
        <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Message templates</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Manage DLT-approved SMS templates for automated communications.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddTemplate}>
          + New Template
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by template name or DLT ID"
            />
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="all">All Languages</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Show inactive templates
          </label>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Active templates: <span className="font-semibold">{activeCount}</span>
          </span>
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
            <thead className="bg-gray-50 dark:bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DLT ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Placeholders
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-white/60 dark:bg-slate-900/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6">
                    <TemplatesSkeleton />
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No templates found. Click “New Template” to get started.
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template._id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 dark:text-slate-100">
                        {template.name}
                      </div>
                      {template.description && (
                        <div className="text-xs text-gray-500">{template.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">
                      {template.dltTemplateId}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-700">
                      {SUPPORTED_LANGUAGES.find((lang) => lang.value === template.language)?.label ||
                        template.language?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{template.variableCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          template.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(template.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        Edit
                      </Button>
                      {canDeactivateTemplates && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => deleteMutation.mutate(template._id)}
                          disabled={!template.isActive || deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Processing…' : 'Deactivate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalMode && (
        <TemplateModal
          mode={modalMode}
          onClose={() => {
            if (!createMutation.isPending && !updateMutation.isPending) {
              setModalMode(null);
              setEditingTemplate(undefined);
            }
          }}
          onSubmit={handleModalSubmit}
          initialData={modalMode === 'edit' ? editingTemplate : undefined}
          isProcessing={createMutation.isPending || updateMutation.isPending}
        />
      )}
        </>
      ) : null}
    </div>
  );
}

