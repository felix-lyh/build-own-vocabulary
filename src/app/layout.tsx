"use client";
import SvgIcon from "@/icons/svg-icon";
// @ts-expect-error CSS is handled by the Next.js bundler, but TypeScript may not declare side-effect CSS imports.
import "./globals.css";
import '@/i18n'
import { Toaster } from "@/components/ui/sonner"
import { usePathname, useRouter } from 'next/navigation'
import { $t } from '@/utils/index'
import HeaderBar from "@/components/header-bar";
import Logo from "@/components/logo";
import ThemeProvider from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import DownloadExtension from "@/components/download-extension";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const routerList = ['vocabulary', 'listening', 'speaking', 'reading', 'writing'] as const;
    type RouterType = (typeof routerList)[number];
    const router = useRouter();
    const pathname = usePathname()
    const toPage = (pageName: RouterType) => {
        if (pathname !== `/${pageName}`) {
            router.push(`/${pageName}`, { scroll: false });
        }
    }
    const currentPath = () => {
        return pathname.slice(1) as RouterType
    }

    // useEffect(()=>{
    //     const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    //     if (!token && routerList.includes(currentPath())) {
    //         router.replace('/login');
    //     }
    // },[pathname])
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="h-fit min-h-[100vh]">
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                    <div className="flex bg-app-bg min-h-[100vh] pb-16 md:pb-0">
                        {routerList.includes(currentPath()) &&
                            <ul className="hidden md:flex flex-col px-[15px] py-[10px] w-[16%] min-w-[200px] bg-surface border-r border-app-border">
                                <li className="mb-[35px]"><Logo></Logo></li>
                                {
                                    routerList.map((item: RouterType) => {
                                        return (
                                            <li onClick={() => toPage(item)}
                                                className={`${currentPath() === item ? 'bg-surface-muted text-theme' : 'text-app-fg'} flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg font-manrope text-sm font-medium hover:bg-surface-muted hover:text-accent-strong transition-all duration-200`} key={item}>
                                                <SvgIcon
                                                    className="dark:invert self-center"
                                                    name={item}
                                                    width={30}
                                                    height={30}
                                                />
                                                <span>{$t(item)}</span>
                                            </li>
                                        )
                                    })
                                }
                                <li className="mt-auto px-3 py-2.5">
                                    <DownloadExtension></DownloadExtension>
                                </li>
                                <li className="flex items-center gap-3 px-3 py-2.5">
                                    <ThemeToggle></ThemeToggle>
                                    <span className="font-manrope text-sm font-medium text-app-fg-muted">{$t('common.switch_theme')}</span>
                                </li>
                            </ul>
                        }
                        <div className="flex-1 min-w-0">
                            {routerList.includes(currentPath()) && <HeaderBar leftContent={$t(currentPath())}></HeaderBar>}
                            <div className={`${routerList.includes(currentPath()) && 'p-[20px]'}`}>
                                {children}
                            </div>
                        </div>
                    </div>
                    {/* mobile bottom navigation */}
                    {routerList.includes(currentPath()) &&
                        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-app-border shadow-[0_-4px_12px_rgba(29,43,41,0.04)]">
                            <ul className="flex justify-around">
                                {
                                    routerList.map((item: RouterType) => {
                                        return (
                                            <li onClick={() => toPage(item)}
                                                className={`${currentPath() === item ? 'text-theme' : 'text-app-fg-muted'} flex-1 flex flex-col items-center gap-0.5 py-2 cursor-pointer transition-colors duration-200`} key={item}>
                                                <SvgIcon
                                                    name={item}
                                                    width={24}
                                                    height={24}
                                                />
                                                <span className="text-[10px] font-manrope font-medium">{$t(item)}</span>
                                            </li>
                                        )
                                    })
                                }
                                <li className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
                                    <ThemeToggle className="w-6 h-6 border-0 bg-transparent"></ThemeToggle>
                                    <span className="text-[10px] font-manrope font-medium text-app-fg-muted">{$t('common.switch_theme')}</span>
                                </li>
                            </ul>
                        </nav>
                    }
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            classNames: {
                                error: "!bg-danger !text-white !border-danger-500",
                                success: "!bg-success !text-white !border-success-500",
                                warning: "!bg-warning !text-black",
                                info: "!bg-blue-500 !text-white",
                            }
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
