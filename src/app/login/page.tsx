'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth-shell';
import AuthField from '@/components/auth-field';
import { login } from '@/request/user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.localStorage.getItem('token')) {
            router.replace('/vocabulary');
        }
    }, [router]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return;

        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_PATTERN.test(normalizedEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        setLoading(true);
        login(normalizedEmail, password)
            .then((res) => {
                const token = res?.payload?.token;
                if (token) {
                    window.localStorage.setItem('token', token);
                }
                toast.success('Access granted — welcome back');
                router.replace('/vocabulary');
            })
            .catch((err: { error?: string }) => {
                toast.error(err?.error || 'Login failed, please try again');
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthShell
            eyebrow="System Access"
            title="Sign in"
            subtitle="Authenticate to enter your vocabulary workspace"
            footer={
                <>
                    New to LexisFlow?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-[#1ABC9C] underline-offset-4 transition-colors hover:text-[#45D6B8] hover:underline"
                    >
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthField
                    id="email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                />
                <AuthField
                    id="password"
                    label="Password"
                    icon={Lock}
                    placeholder="Enter your password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                    passwordToggle
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] text-sm font-semibold text-white shadow-[0_0_24px_rgba(26,188,156,0.35)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    );
}
