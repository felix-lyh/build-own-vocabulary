'use client';
import type { ReactNode } from 'react';
import { Terminal } from 'lucide-react';
import WordsRain from '@/components/words-rain';

interface AuthShellProps {
    eyebrow: string;
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
}

function CornerBracket({ position }: { position: string }) {
    return (
        <span
            className={`pointer-events-none absolute h-5 w-5 border-[#1ABC9C]/70 ${position}`}
            aria-hidden="true"
        />
    );
}

export default function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
    return (
        <div className="fixed inset-0 overflow-y-auto bg-[#040c0a]">
            {/* words rain background */}
            <WordsRain />

            {/* atmosphere overlays: grid + vignette + top glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(26,188,156,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(26,188,156,0.05)_1px,transparent_1px)] bg-[size:44px_44px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,12,10,0.55)_70%,rgba(4,12,10,0.92)_100%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1ABC9C]/10 to-transparent"
            />

            <div className="relative z-10 flex min-h-full items-center justify-center p-4 py-10 sm:p-6">
                <div className="relative w-full max-w-md">
                    {/* glow behind card */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-6 rounded-3xl bg-[#1ABC9C]/10 blur-2xl"
                    />
                    <div className="relative overflow-hidden rounded-2xl border border-[#1ABC9C]/25 bg-[#06110e]/70 shadow-[0_0_60px_rgba(26,188,156,0.15)] backdrop-blur-xl">
                        {/* HUD corner brackets */}
                        <CornerBracket position="left-3 top-3 border-l-2 border-t-2" />
                        <CornerBracket position="right-3 top-3 border-r-2 border-t-2" />
                        <CornerBracket position="bottom-3 left-3 border-b-2 border-l-2" />
                        <CornerBracket position="bottom-3 right-3 border-b-2 border-r-2" />

                        <div className="p-6 sm:p-8">
                            <div className="mb-6 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] shadow-lg shadow-[#1ABC9C]/40">
                                    <Terminal className="h-6 w-6 text-white" strokeWidth={2.2} />
                                </div>
                                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#1ABC9C]">
                                    {eyebrow}
                                </p>
                                <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
                                <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>
                            </div>

                            {children}

                            {footer && (
                                <p className="mt-6 text-center text-sm text-white/50">{footer}</p>
                            )}
                        </div>
                    </div>

                    <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                        LexisFlow // Vocabulary Operating System
                    </p>
                </div>
            </div>
        </div>
    );
}
