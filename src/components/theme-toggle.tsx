'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { $t } from '@/utils/index'

/**
 * Light / dark theme switch button.
 * Renders a fixed-size placeholder before mount so the markup
 * matches on the server and the client (avoids hydration mismatch).
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const isDark = theme === 'dark'
    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

    const baseClass = 'flex items-center justify-center w-10 h-10 rounded-lg border border-app-border bg-surface text-app-fg hover:bg-surface-muted hover:text-accent-strong active:scale-95 transition-all'

    if (!mounted) {
        return <span className={`${baseClass} ${className}`} aria-hidden="true"></span>
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={$t('common.switch_theme')}
            title={isDark ? $t('common.light_theme') : $t('common.dark_theme')}
            className={`${baseClass} ${className}`}
        >
            {isDark ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
        </button>
    )
}
