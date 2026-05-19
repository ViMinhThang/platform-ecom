'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useGetUserProfileQuery } from '@/lib/store/api/clientApi';

export function StoreInitializer() {
    const { data: session, status } = useSession();
    const initialized = useRef(false);

    useGetUserProfileQuery(undefined, { skip: status !== 'authenticated' });

    useEffect(() => {
        if (status === 'authenticated' && session?.user && !initialized.current) {
            if ((session.user as any).accessToken) {
                initialized.current = true;
            }
        }
    }, [status, session]);

    return null;
}
