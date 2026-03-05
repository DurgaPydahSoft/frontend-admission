'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { visitorAPI } from '@/lib/api';
import { showToast } from '@/lib/toast';
import {
    User, Phone, RefreshCw, Loader2,
    History, Clock, CheckCircle2, AlertCircle, MapPin,
    Users, Search, ChevronRight, Hash
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function VisitorsPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [visitorData, setVisitorData] = useState<any>(null);
    const [consuming, setConsuming] = useState(false);
    const [recentVisits, setRecentVisits] = useState<any[]>([]);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const fetchRecentVisits = async () => {
        try {
            const response = await visitorAPI.getRecent();
            if (response.success) {
                setRecentVisits(response.data);
            }
        } catch (error) {
            console.error('Error fetching recent visits:', error);
        } finally {
            setLoadingRecent(false);
        }
    };

    useEffect(() => {
        fetchRecentVisits();
    }, []);

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!code || code.length !== 6) {
            showToast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setVisitorData(null);
        try {
            const response = await visitorAPI.verifyCode(code);
            if (response.success) {
                setVisitorData(response.data);
                showToast.success('Code verified successfully');
            } else {
                showToast.error(response.message || 'Invalid or expired code');
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConsume = async () => {
        if (!visitorData) return;

        setConsuming(true);
        try {
            const response = await visitorAPI.consumeCode(code, visitorData.lead_id);
            if (response.success) {
                showToast.success('Visitor check-in successful! Campus attendance recorded.');
                setVisitorData(null);
                setCode('');
                fetchRecentVisits();
            } else {
                showToast.error(response.message || 'Failed to confirm attendance');
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setConsuming(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Visitor Verification
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Process on-campus attendance by validating counselor-generated access codes.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Live
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Section */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Verification Input Card */}
                    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        Validate Access Code
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Enter the 6-digit code provided by the student.</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    <Clock className="w-3.5 h-3.5" />
                                    24h Validity
                                </div>
                            </div>

                            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                        <Hash className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-11 pr-4 py-3.5 text-2xl tracking-[0.2em] font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading || code.length !== 6}
                                    className="h-[58px] sm:w-40 text-base font-bold bg-slate-900 dark:bg-orange-500 hover:bg-slate-800 dark:hover:bg-orange-600 rounded-xl"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                                </Button>
                            </form>

                            <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                                <span>Verification codes are single-use and expire 24 hours after generation.</span>
                            </div>
                        </div>
                    </Card>

                    {/* Visitor Result Card */}
                    {visitorData && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                                {/* Result Header */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                                                {visitorData.lead_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase">
                                                        {visitorData.current_lead_status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{visitorData.lead_enquiry_number}</span>
                                                </div>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{visitorData.lead_name}</h2>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    Student Information Validated
                                                </p>
                                            </div>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Counseling Lead</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{visitorData.sender_name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Result Details */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{visitorData.lead_phone}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent/Guardian</p>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-indigo-500" />
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{visitorData.lead_father_name || '—'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{visitorData.lead_district || '—'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                        <Clock className="w-4 h-4" />
                                        <span>Code Expires: {format(new Date(visitorData.expires_at), 'MMM d, h:mm a')}</span>
                                    </div>
                                    <Button
                                        onClick={handleConsume}
                                        disabled={consuming}
                                        className="w-full sm:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        {consuming ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Confirm Attendance
                                                <ChevronRight className="w-4 h-4 opacity-50" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Sidebar: Recent Activity */}
                <div className="lg:col-span-4 h-full">
                    <Card className="flex flex-col h-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm sticky top-6">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                                    Recent Verification
                                </h3>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Last 10 records</p>
                            </div>
                            <button
                                onClick={fetchRecentVisits}
                                disabled={loadingRecent}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-orange-500 transition-colors"
                            >
                                <RefreshCw className={cn("w-4 h-4", loadingRecent && "animate-spin")} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[400px]">
                            {loadingRecent ? (
                                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                                    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                </div>
                            ) : recentVisits.length === 0 ? (
                                <div className="text-center py-20 opacity-40">
                                    <History className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                                    <p className="text-xs font-semibold uppercase tracking-wider">No visits recorded</p>
                                </div>
                            ) : (
                                recentVisits.map((visit) => (
                                    <div
                                        key={visit.id}
                                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-105",
                                                visit.status === 'used'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                    : visit.status === 'expired'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                                            )}>
                                                {visit.status === 'used' ? <CheckCircle2 className="w-5 h-5" /> : visit.code}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                                                        {visit.lead_name}
                                                    </h4>
                                                    <span className={cn(
                                                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                                        visit.status === 'used' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                    )}>
                                                        {visit.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-[10px] text-slate-500 truncate">Agent: {visit.sender_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{format(new Date(visit.created_at), 'h:mm a')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
