"use client";
import SvgIcon from "@/icons/svg-icon";
import "./globals.css";
import '@/i18n'
import { Toaster } from "@/components/ui/sonner"
import { usePathname, useRouter } from 'next/navigation'
import { $t } from '@/utils/index'
import HeaderBar from "@/components/header-bar";
import Logo from "@/components/logo";
import { useEffect } from "react";
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

    useEffect(()=>{
        // const token = localStorage.getItem('token')
        // if (!token) {
        //     router.push('/login')
        // }
    },[])
    return (
        <html lang="en">
            <body className="h-fit min-h-[100vh]">
                <div className="flex bg-[#F5F5F5] min-h-[100vh] pb-16 md:pb-0">
                    {routerList.includes(currentPath()) &&
                        <ul className="hidden md:block px-[15px] py-[10px] w-[16%] min-w-[200px] bg-white">
                            <li className="mb-[35px]"><Logo></Logo></li>
                            {
                                routerList.map((item: RouterType) => {
                                    return (
                                        <li onClick={() => toPage(item)}
                                            className={`${currentPath() === item ? 'bg-[#F8F9FA] text-theme' : 'text-[#333]'} flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg font-manrope text-sm font-medium hover:bg-[#F8F9FA] hover:text-[#2EB7A3] transition-all duration-200`} key={item}>
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
                    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E9ECEF] shadow-[0_-4px_12px_rgba(29,43,41,0.04)]">
                        <ul className="flex justify-around">
                            {
                                routerList.map((item: RouterType) => {
                                    return (
                                        <li onClick={() => toPage(item)}
                                            className={`${currentPath() === item ? 'text-theme' : 'text-zinc-400'} flex-1 flex flex-col items-center gap-0.5 py-2 cursor-pointer transition-colors duration-200`} key={item}>
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
            </body>
        </html>
    );
}
