'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';

const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        try {
            if (isMockMode()) {
                // Mock mode - simulate login
                const { setMockLoggedIn } = await import('@/lib/mock/auth');
                setMockLoggedIn(true);
                router.push(redirect);
                router.refresh();
                return;
            }

            // Production mode
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;
                setMessage('확인 이메일을 보냈습니다. 이메일을 확인해주세요.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                router.push(redirect);
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-6 h-6 text-brand-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isSignUp ? '회원가입' : '로그인'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isMockMode()
                        ? '목업 모드 - 아무 값이나 입력하세요'
                        : (isSignUp ? '계정을 만들어 처방전을 보관하세요' : '보관함을 사용하려면 로그인하세요')
                    }
                </p>
                {isMockMode() && (
                    <div className="mt-2 inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                        MOCK MODE
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        이메일
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl
                                     focus:outline-none focus:border-brand-primary"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        비밀번호
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl
                                     focus:outline-none focus:border-brand-primary"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-brand-primary text-white font-medium rounded-xl
                             disabled:opacity-50 hover:bg-blue-700 active:scale-[0.98] transition-all
                             flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>처리 중...</span>
                        </>
                    ) : (
                        <span>{isSignUp ? '가입하기' : '로그인'}</span>
                    )}
                </button>
            </form>

            {!isMockMode() && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-gray-500 hover:text-brand-primary"
                    >
                        {isSignUp ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
