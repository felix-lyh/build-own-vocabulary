'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * Wraps next-themes so the whole app can switch between the
 * light and dark ("white" / "black") themes.
 * The chosen theme is persisted in localStorage and applied as
 * a `dark` class on the <html> element (see tailwind darkMode: ["class"]).
 */
export default function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
