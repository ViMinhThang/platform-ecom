'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/store/hooks';
import { fetchUserProfile, setUser } from '@/lib/store/slices/authSlice';

export function StoreInitializer() {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user && !initialized.current) {
            // Option 1: Fetch fresh profile from API (Recommended)
             if ((session.user as any).accessToken) {
                 dispatch(fetchUserProfile({ token: (session.user as any).accessToken }));
                 initialized.current = true;
             }
        }
    }, [status, session, dispatch]);

    return null;
}
