'use client';
import { useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthFieldProps {
    id: string;
    label: string;
    icon: LucideIcon;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    /** Show an eye button to toggle password visibility */
    passwordToggle?: boolean;
}

export default function AuthField({
    id,
    label,
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    autoComplete,
    passwordToggle = false,
}: AuthFieldProps) {
    const [visible, setVisible] = useState(false);
    const inputType = passwordToggle ? (visible ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={id}
                className="block font-mono text-[11px] uppercase tracking-[0.2em] text-white/60"
            >
                {label}
            </label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1ABC9C]/80" />
                <Input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={cn(
                        'h-11 rounded-lg border-[#1ABC9C]/25 bg-white/[0.04] pl-10 text-sm text-white shadow-none',
                        'placeholder:text-white/30',
                        'focus-visible:border-[#1ABC9C]/70 focus-visible:ring-2 focus-visible:ring-[#1ABC9C]/30',
                        passwordToggle && 'pr-10'
                    )}
                />
                {passwordToggle && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-[#1ABC9C]"
                    >
                        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}
