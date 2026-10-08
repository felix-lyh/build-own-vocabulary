'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth-shell';
import AuthField from '@/components/auth-field';
import { register } from '@/request/user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.localStorage.getItem('token')) {
            router.replace('/vocabulary');
        }
    }, [router]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return;

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!trimmedName) {
            toast.error('Please enter a display name');
            return;
        }
        if (!EMAIL_PATTERN.test(normalizedEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        register(trimmedName, normalizedEmail, password)
            .then((res) => {
                const token = res?.payload?.token;
                if (token) {
                    window.localStorage.setItem('token', token);
                }
                toast.success('Account created — welcome to LexisFlow');
                router.replace('/vocabulary');
            })
            .catch((err: { error?: string }) => {
                toast.error(err?.error || 'Registration failed, please try again');
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthShell
            eyebrow="New Registration"
            title="Create account"
            subtitle="Bootstrap your personal vocabulary database"
            footer={
                <>
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-[#1ABC9C] underline-offset-4 transition-colors hover:text-[#45D6B8] hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthField
                    id="name"
                    label="Display name"
                    icon={User}
                    placeholder="Your name"
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                />
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
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    passwordToggle
                />
                <AuthField
                    id="confirmPassword"
                    label="Confirm password"
                    icon={ShieldCheck}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
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
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create account
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    );
}
