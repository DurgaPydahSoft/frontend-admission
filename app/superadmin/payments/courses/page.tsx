'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { courseAPI } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Branch, Course } from '@/types';
import { useDashboardHeader } from '@/components/layout/DashboardShell';

type ManagedCourse = Course & { branches?: Branch[] };

type BranchFormState = {
  name: string;
  code: string;
  description: string;
};

const emptyBranchForm: BranchFormState = {
  name: '',
  code: '',
  description: '',
};

export default function CourseManagementPage() {
  const { setHeaderContent, clearHeaderContent } = useDashboardHeader();

  useEffect(() => {
    setHeaderContent(
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Course &amp; Branch Setup
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Maintain the official list of courses and branches. These drive joining form selections and
          payment fee mapping.
        </p>
      </div>
    );
    return () => clearHeaderContent();
  }, [setHeaderContent, clearHeaderContent]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courses', 'with-branches'],
    queryFn: async () => {
      const response = await courseAPI.list({ includeBranches: true, showInactive: true });
      return response;
    },
  });

  const courses: ManagedCourse[] = useMemo(() => {
    const payload = data?.data;
    if (Array.isArray(payload)) {
      return payload as ManagedCourse[];
    }
    if (payload && Array.isArray((payload as any).data)) {
      return (payload as any).data as ManagedCourse[];
    }
    return [];
  }, [data]);

  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [branchForms, setBranchForms] = useState<Record<string, BranchFormState>>({});
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [branchModalCourseId, setBranchModalCourseId] = useState<string | null>(null);

  const createCourseMutation = useMutation({
    mutationFn: (payload: { name: string; code?: string; description?: string }) =>
      courseAPI.create(payload),
    onSuccess: () => {
      showToast.success('Course created successfully');
      setNewCourse({ name: '', code: '', description: '' });
      setIsCreateCourseOpen(false);
      refetch();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || 'Failed to create course');
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: { name?: string; code?: string; description?: string; isActive?: boolean };
    }) => courseAPI.update(courseId, payload),
    onSuccess: () => {
      refetch();
      showToast.success('Course updated');
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || 'Failed to update course');
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => courseAPI.delete(courseId),
    onSuccess: () => {
      refetch();
      showToast.success('Course deleted');
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || 'Unable to delete course');
    },
  });

  const createBranchMutation = useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: { name: string; code?: string; description?: string };
    }) => courseAPI.createBranch(courseId, payload),
    onSuccess: (_, variables) => {
      const { courseId } = variables;
      setBranchForms((prev) => ({
        ...prev,
        [courseId]: emptyBranchForm,
      }));
      setBranchModalCourseId(null);
      refetch();
      showToast.success('Branch added');
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || 'Failed to add branch');
    },
  });

  const updateBranchMutation = useMutation({
    mutationFn: ({
      courseId,
      branchId,
      payload,
    }: {
      courseId: string;
      branchId: string;
      payload: { name?: string; code?: string; description?: string; isActive?: boolean };
    }) => courseAPI.updateBranch(courseId, branchId, payload),
    onSuccess: () => {
      refetch();
      showToast.success('Branch updated');
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || 'Failed to update branch');
    },
  });

  const handleCreateCourse = () => {
    if (!newCourse.name.trim()) {
      showToast.error('Course name is required');
      return;
    }
    createCourseMutation.mutate({
      name: newCourse.name.trim(),
      code: newCourse.code.trim() || undefined,
      description: newCourse.description.trim() || undefined,
    });
  };

  const handleEditCourse = (course: ManagedCourse) => {
    const nextName = window.prompt('Update course name', course.name);
    if (nextName === null) return;
    if (!nextName.trim()) {
      showToast.error('Course name cannot be empty');
      return;
    }
    updateCourseMutation.mutate({
      courseId: course._id,
      payload: { name: nextName.trim() },
    });
  };

  const handleToggleCourse = (course: ManagedCourse) => {
    updateCourseMutation.mutate({
      courseId: course._id,
      payload: { isActive: !course.isActive },
    });
  };

  const handleDeleteCourse = (course: ManagedCourse) => {
    if ((course.branches?.length || 0) > 0) {
      showToast.error('Remove all branches before deleting a course.');
      return;
    }
    const confirmed = window.confirm(
      `Delete course "${course.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    deleteCourseMutation.mutate(course._id);
  };

  const handleAddBranch = (courseId: string) => {
    const form = branchForms[courseId] || emptyBranchForm;
    if (!form.name.trim()) {
      showToast.error('Branch name is required');
      return;
    }
    createBranchMutation.mutate({
      courseId,
      payload: {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        description: form.description.trim() || undefined,
      },
    });
  };

  const handleEditBranch = (courseId: string, branch: Branch) => {
    const nextName = window.prompt('Update branch name', branch.name);
    if (nextName === null) return;
    if (!nextName.trim()) {
      showToast.error('Branch name cannot be empty');
      return;
    }
    updateBranchMutation.mutate({
      courseId,
      branchId: branch._id,
      payload: { name: nextName.trim() },
    });
  };

  const handleToggleBranch = (courseId: string, branch: Branch) => {
    updateBranchMutation.mutate({
      courseId,
      branchId: branch._id,
      payload: { isActive: !branch.isActive },
    });
  };

  const isBusy =
    createCourseMutation.isPending ||
    updateCourseMutation.isPending ||
    createBranchMutation.isPending ||
    updateBranchMutation.isPending ||
    deleteCourseMutation.isPending;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Courses &amp; Branches
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage the catalog used across joining forms and payment configuration.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => refetch()} disabled={isBusy || isLoading}>
              Refresh
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setNewCourse({ name: '', code: '', description: '' });
                setIsCreateCourseOpen(true);
              }}
            >
              Create Course
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/60 bg-white/95 p-10 text-center text-sm text-slate-500 shadow-lg shadow-blue-100/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400 dark:shadow-none">
            Loading courses…
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
            No courses yet. Create your first course to begin mapping branches and fees.
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              return (
                <div
                  key={course._id}
                  className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-lg shadow-blue-100/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {course.name}
                        </h3>
                        {!course.isActive && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {course.code && <span>Code: {course.code} · </span>}
                        <span>{course.description || 'No description provided.'}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        {course.branches?.length || 0} branch
                        {(course.branches?.length || 0) === 1 ? '' : 'es'}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => handleEditCourse(course)}>
                        Rename
                      </Button>
                      <Button variant="secondary" onClick={() => handleToggleCourse(course)}>
                        {course.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setBranchForms((prev) => ({
                            ...prev,
                            [course._id]: emptyBranchForm,
                          }));
                          setBranchModalCourseId(course._id);
                        }}
                      >
                        Add Branch
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteCourse(course)}
                        disabled={deleteCourseMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Branches
                    </h4>
                    {course.branches && course.branches.length > 0 ? (
                      <div className="space-y-3">
                        {course.branches.map((branch) => (
                          <div
                            key={branch._id}
                            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm transition hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900/60"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {branch.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {branch.code ? `Code: ${branch.code}` : 'No code'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={() => handleEditBranch(course._id, branch)}
                                >
                                  Rename
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleToggleBranch(course._id, branch)}
                                >
                                  {branch.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </div>
                            </div>
                            {branch.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {branch.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
                        No branches added yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {isCreateCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl shadow-blue-100/30 dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Create Course
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add a course so it appears in joining workflows and payment configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateCourseOpen(false);
                  setNewCourse({ name: '', code: '', description: '' });
                }}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close create course dialog"
                disabled={createCourseMutation.isPending}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input
                label="Course Name"
                value={newCourse.name}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. B.Tech"
              />
              <Input
                label="Course Code (optional)"
                value={newCourse.code}
                onChange={(event) => setNewCourse((prev) => ({ ...prev, code: event.target.value }))}
                placeholder="Internal reference"
              />
              <div className="md:col-span-2">
                <Input
                  label="Description (optional)"
                  value={newCourse.description}
                  onChange={(event) =>
                    setNewCourse((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Short description for admins"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreateCourseOpen(false);
                  setNewCourse({ name: '', code: '', description: '' });
                }}
                disabled={createCourseMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateCourse}
                disabled={createCourseMutation.isPending}
              >
                {createCourseMutation.isPending ? 'Creating…' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {branchModalCourseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl shadow-blue-100/30 dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Add Branch
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create a branch under{' '}
                  <span className="font-semibold">
                    {courses.find((c) => c._id === branchModalCourseId)?.name || 'this course'}
                  </span>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (branchModalCourseId) {
                    setBranchForms((prev) => ({
                      ...prev,
                      [branchModalCourseId]: emptyBranchForm,
                    }));
                  }
                  setBranchModalCourseId(null);
                }}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close add branch dialog"
                disabled={createBranchMutation.isPending}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input
                label="Branch Name"
                value={(branchForms[branchModalCourseId]?.name) || ''}
                onChange={(event) =>
                  setBranchForms((prev) => ({
                    ...prev,
                    [branchModalCourseId]: {
                      ...(prev[branchModalCourseId] || emptyBranchForm),
                      name: event.target.value,
                    },
                  }))
                }
                placeholder="e.g. Computer Science"
              />
              <Input
                label="Branch Code (optional)"
                value={(branchForms[branchModalCourseId]?.code) || ''}
                onChange={(event) =>
                  setBranchForms((prev) => ({
                    ...prev,
                    [branchModalCourseId]: {
                      ...(prev[branchModalCourseId] || emptyBranchForm),
                      code: event.target.value,
                    },
                  }))
                }
                placeholder="Short code"
              />
              <div className="md:col-span-2">
                <Input
                  label="Description (optional)"
                  value={(branchForms[branchModalCourseId]?.description) || ''}
                  onChange={(event) =>
                    setBranchForms((prev) => ({
                      ...prev,
                      [branchModalCourseId]: {
                        ...(prev[branchModalCourseId] || emptyBranchForm),
                        description: event.target.value,
                      },
                    }))
                  }
                  placeholder="Brief description for admins"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  if (branchModalCourseId) {
                    setBranchForms((prev) => ({
                      ...prev,
                      [branchModalCourseId]: emptyBranchForm,
                    }));
                  }
                  setBranchModalCourseId(null);
                }}
                disabled={createBranchMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => branchModalCourseId && handleAddBranch(branchModalCourseId)}
                disabled={createBranchMutation.isPending}
              >
                {createBranchMutation.isPending ? 'Adding…' : 'Add Branch'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


