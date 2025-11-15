import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseAPI } from '@/lib/api';
import { Course, Branch } from '@/types';

export interface CourseLookup {
  courses: Map<string, string>;
  branches: Map<string, string>;
  getCourseName: (courseId?: string | null) => string;
  getBranchName: (branchId?: string | null) => string;
  isLoading: boolean;
}

/**
 * Hook to fetch and provide course/branch lookup maps from courseId/branchId
 */
export const useCourseLookup = (): CourseLookup => {
  const { data: coursesResponse, isLoading } = useQuery({
    queryKey: ['courses', 'lookup'],
    queryFn: async () => {
      const response = await courseAPI.list({ includeBranches: true, showInactive: true });
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const lookup = useMemo(() => {
    const payload = coursesResponse?.data;
    const courseList: Array<Course & { branches?: Branch[] }> = Array.isArray(payload)
      ? (payload as Array<Course & { branches?: Branch[] }>)
      : Array.isArray((payload as any)?.data)
      ? ((payload as any).data as Array<Course & { branches?: Branch[] }>)
      : [];

    const courses = new Map<string, string>();
    const branches = new Map<string, string>();

    courseList.forEach((item) => {
      courses.set(item._id, item.name);
      (item.branches || []).forEach((branch) => {
        branches.set(branch._id, branch.name);
      });
    });

    return { courses, branches };
  }, [coursesResponse]);

  const getCourseName = (courseId?: string | null): string => {
    if (!courseId) return '—';
    return lookup.courses.get(courseId) || '—';
  };

  const getBranchName = (branchId?: string | null): string => {
    if (!branchId) return '—';
    return lookup.branches.get(branchId) || '—';
  };

  return {
    courses: lookup.courses,
    branches: lookup.branches,
    getCourseName,
    getBranchName,
    isLoading,
  };
};

