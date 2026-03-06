'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * SSOHandler component
 * Detects 'token' parameter in URL and clears existing sessions
 * to ensure a clean slate for the new SSO login.
 */
export const SSOHandler = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ssoToken = searchParams.get('token');

        if (ssoToken) {
            console.log('SSO Token detected. Clearing existing local sessions to prioritize new login.');

            // Clear existing local sessions
            auth.clearAuth();

            // The existing SSO verify-token logic in LoginPageContent will then proceed
            // with a clean slate when the user hits the /auth/login route (or stays there).
        }
    }, [searchParams]);

    return null;
};
