'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { leadAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDashboardHeader } from '@/components/layout/DashboardShell';
import { Input } from '@/components/ui/Input';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export default function GroupUpdatePage() {
  const router = useRouter();
  const { setHeaderContent, clearHeaderContent } = useDashboardHeader();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'sync'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ updatedInDB?: number; totalInExcel: number; stagedInTempTable?: number } | null>(null);
  const [syncResult, setSyncResult] = useState<{ updatedInDB: number } | null>(null);
  const [syncProgress, setSyncProgress] = useState({ processed: 0, updated: 0, total: 0 });
  const [stagedCount, setStagedCount] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = auth.getUser();
    if (!currentUser || (currentUser.roleName !== 'Super Admin' && currentUser.roleName !== 'Sub Super Admin')) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    setHeaderContent(
      <div className="flex flex-col items-end gap-2 text-right">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Student Group Manager</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bulk update 'Inter' student groups via Excel
        </p>
      </div>
    );
    return () => clearHeaderContent();
  }, [setHeaderContent, clearHeaderContent]);

  const fetchStagedCount = async () => {
    try {
      const data = await leadAPI.getStagedCount();
      setStagedCount(typeof data.count === 'number' ? data.count : Number(data.count || 0));
      if (data.count > 0) {
        setSyncProgress(prev => ({ ...prev, total: data.count }));
      }
    } catch (err) {
      console.error('Failed to fetch staged count', err);
    }
  };

  useEffect(() => {
    fetchStagedCount();
  }, [activeTab]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpdate = async () => {
    if (!file) {
      setError('Please select an Excel file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await leadAPI.bulkUpdateLeadGroups(formData);
      setResult(response);
      fetchStagedCount(); // Update staged count after upload
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update groups');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalSync = async () => {
    const totalToProcess = stagedCount || 0;
    if (totalToProcess === 0) {
      setError('No staged data found in the sync area. Please upload a file first.');
      return;
    }

    setIsSyncing(true);
    setError(null);
    setSyncResult(null);
    setSyncProgress({ processed: 0, updated: 0, total: totalToProcess });

    const limit = 5000;
    let processed = 0;
    let totalUpdated = 0;

    try {
      while (processed < totalToProcess) {
        const response = await leadAPI.executeGroupSync(limit, processed);
        processed += limit;
        totalUpdated += response?.updatedInChunk || 0;
        
        setSyncProgress({
          processed: Math.min(processed, totalToProcess),
          updated: totalUpdated,
          total: totalToProcess
        });

        if (processed % 15000 === 0) {
           await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      setSyncResult({ updatedInDB: totalUpdated });
      fetchStagedCount(); // Refresh count after sync (may have cleared or changed)
    } catch (err: any) {
      console.error('Sync Error:', err);
      setError(err.response?.data?.message || err.message || 'Sync execution failed');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/50">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-blue-700 shadow dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-600 hover:bg-white/[0.12] hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          1. Upload & Stage Data
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all ${
            activeTab === 'sync'
              ? 'bg-white text-blue-700 shadow dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-600 hover:bg-white/[0.12] hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          2. Final Sync Operation
        </button>
      </div>

      <Card>
        {activeTab === 'upload' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
              <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Upload Instructions</h4>
              <p className="text-sm text-blue-800 mb-3 dark:text-blue-200">
                This step will only store the data in a temporary sync area. No actual leads will be modified yet.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Column: <strong>STU_NAME</strong> (Student Name)</li>
                <li>Column: <strong>STU_MOBILENO</strong> (Mobile Number - Matches `phone`)</li>
                <li>Column: <strong>COURSE_NAME</strong> (New Group - e.g., Inter-MPC)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                {file ? (
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{file?.name}</p>
                    <p className="text-sm text-slate-500">{(file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0')} MB</p>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-4" disabled={isProcessing}>
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">Select Excel workbook</p>
                    <p className="text-sm text-slate-500">Drop your file here or click to browse</p>
                    <Button variant="primary" size="lg" onClick={() => fileInputRef.current?.click()} className="mt-6">
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                  {error}
                </div>
              )}

              {result && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/30 dark:bg-emerald-900/10">
                  <div className="mb-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {result?.stagedInTempTable?.toLocaleString() || result?.totalInExcel?.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Records Staged Successfully
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    You can now switch to the **Final Sync** tab to update the leads database.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab('sync')}>
                    Go to Sync Tab
                  </Button>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleUpdate}
                isLoading={isProcessing}
                disabled={!file || isProcessing}
                className="w-full py-6 text-lg"
              >
                Upload & Stage Data
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 text-center pb-8">
            <div className="mx-auto max-w-2xl rounded-2xl border border-blue-100 bg-blue-50/30 p-8 dark:border-blue-900/20 dark:bg-blue-900/5">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">Current Staging Pool</h3>
              
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="text-5xl font-black text-blue-600">
                  {stagedCount !== null ? stagedCount.toLocaleString() : '...'}
                </div>
                <button 
                  onClick={fetchStagedCount}
                  className="rounded-full p-2 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  title="Refresh count from database"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Records currently waiting in the temporary sync area.
              </p>
            </div>

            <div className="mx-auto max-w-md space-y-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-left dark:border-amber-900/30 dark:bg-amber-900/10">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Sync Rules & Scope</h4>
              <ul className="list-inside list-disc space-y-1 text-xs text-amber-800 dark:text-amber-200">
                <li>Matches on <strong>STU_NAME</strong> + <strong>STU_MOBILENO</strong>.</li>
                <li>Targets only Leads where group is currently <strong>'Inter'</strong>.</li>
                <li>Auto-prefixes groups (e.g., <strong>MPC</strong> becomes <strong>Inter-MPC</strong>).</li>
              </ul>
            </div>

              {error && activeTab === 'sync' && (
                <div className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {syncProgress.total > 0 && !syncResult && (
                <div className="mt-8 w-full space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Synchronizing Data...</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {Math.round((syncProgress.processed / syncProgress.total) * 100)}%
                    </span>
                  </div>
                  
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${(syncProgress.processed / syncProgress.total) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="rounded-lg bg-slate-50 p-3 text-left dark:bg-slate-900/50">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Processed</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100 italic">
                        {syncProgress.processed.toLocaleString()} / {syncProgress.total.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 text-left dark:bg-blue-900/10">
                      <div className="text-xs text-blue-500 uppercase tracking-wider">Matched & Updated</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {syncProgress.updated.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {syncResult && (
                <div className="mt-6 w-full rounded-xl border border-blue-200 bg-blue-50 p-6 text-center shadow-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{syncResult?.updatedInDB?.toLocaleString()}</div>
                  <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">Sync Complete!</div>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    Your leads have been successfully updated based on the Excel data.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => { setFile(null); setResult(null); setSyncResult(null); setSyncProgress({processed:0, updated:0, total:0}); setActiveTab('upload'); }} className="mt-6 border-blue-200 text-blue-700 hover:bg-blue-100">
                    Start New Sync
                  </Button>
                </div>
              )}

              {!syncResult && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinalSync}
                  isLoading={isSyncing}
                  disabled={isSyncing || (stagedCount || 0) === 0}
                  className="mt-8 w-full max-w-md bg-blue-600 py-6 text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                >
                  {isSyncing ? 'Processing batches...' : 'Execute Final Sync'}
                </Button>
              )}

              {!isSyncing && !syncResult && (stagedCount || 0) > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm('This will reset the "needs_manual_update" flag back to default for all leads that were previously synced from this pool. Continue?')) {
                      try {
                        setIsSyncing(true);
                        const res = await leadAPI.revertGroupSyncFlag();
                        alert(`Successfully reset flags for ${res.affectedRows || 0} leads.`);
                        fetchStagedCount();
                      } catch (err) {
                        alert('Failed to reset flags.');
                      } finally {
                        setIsSyncing(false);
                      }
                    }
                  }}
                  className="mt-4 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors mx-auto"
                >
                  <RefreshCw className="h-3 w-3" />
                  Revert "manual update" flags for this pool
                </button>
              )}
            </div>
        )}
      </Card>
    </div>
  );
}
