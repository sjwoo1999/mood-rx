'use client';

import Link from 'next/link';
import { Pill, Archive, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Check if mock mode is enabled
const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export default function Header() {
    const [user, setUser] = useState<SupabaseUser | { id: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            if (isMockMode()) {
                // Mock mode - use mock user
                const { MOCK_USER } = await import('@/lib/mock/data');
                const { isMockLoggedIn } = await import('@/lib/mock/auth');
                setUser(isMockLoggedIn() ? MOCK_USER : null);
                setLoading(false);
                setClientReady(true);
            } else {
                // Production mode - use Supabase
                try {
                    const { createClient } = await import('@/lib/supabase/client');
                    const client = createClient();
                    setClientReady(true);

                    const { data: { user } } = await client.auth.getUser();
                    setUser(user);
                    setLoading(false);

                    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
                        setUser(session?.user ?? null);
                    });

                    return () => subscription.unsubscribe();
                } catch (error) {
                    console.error('Auth init error:', error);
                    setLoading(false);
                    setClientReady(true);
                }
            }
        };

        initAuth();
    }, []);

    const handleLogout = useCallback(async () => {
        if (isMockMode()) {
            const { setMockLoggedIn } = await import('@/lib/mock/auth');
            setMockLoggedIn(false);
            setUser(null);
        } else {
            const { createClient } = await import('@/lib/supabase/client');
            const client = createClient();
            await client.auth.signOut();
        }
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-primary">
                    <Pill className="w-6 h-6" />
                    <span>Mood Rx</span>
                    {isMockMode() && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">
                            MOCK
                        </span>
                    )}
                </Link>

                <nav className="flex items-center gap-4">
                    <Link
                        href="/rx/new"
                        className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                    >
                        새 처방
                    </Link>

                    {clientReady && !loading && (
                        <>
                            {user ? (
                                <>
                                    <Link
                                        href="/vault"
                                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                                    >
                                        <Archive className="w-4 h-4" />
                                        <span>보관함</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>로그아웃</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>로그인</span>
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
