"use client"
import { useState, useEffect } from "react";
import { $t } from "@/utils/index";
import { Download, Puzzle, MousePointerClick, BookOpenText, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;
const downloadUrl = `${baseURL}/api/extension/download`;

export default function DownloadExtension() {
    const [tipsOpen, setTipsOpen] = useState(false);
    const handleDownloadExtension = () => {
        try {
            window.open(downloadUrl, '_blank');
        } catch (error) {
            console.error('Error downloading extension:', error);
        }
    }
    // close tips on Escape
    useEffect(() => {
        if (!tipsOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setTipsOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [tipsOpen]);
    return (
        <div className="flex items-center gap-2 w-full">
            <Button size="sm" onClick={handleDownloadExtension} className="flex-1 justify-start gap-2">
                <Download width={15} height={15} />
                {$t('common.download_extension')}
            </Button>
            <Popover open={tipsOpen} onOpenChange={setTipsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        aria-label={$t('common.download_extension.tips_title')}
                        title={$t('common.download_extension.tips_title')}
                        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-app-fg-muted hover:text-accent-strong hover:bg-accent-soft active:scale-95 transition-all"
                    >
                        <Info width={17} height={17} />
                    </button>
                </PopoverTrigger>
                <PopoverContent side="right" align="center" sideOffset={12} className="w-72 rounded-xl border border-app-border bg-surface p-4 shadow-xl">
                    <div className="flex flex-col gap-3">
                        {/* title */}
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-soft text-[#1ABC9C]">
                                <Puzzle width={16} height={16} />
                            </span>
                            <p className="font-semibold text-sm text-app-fg">{$t('common.download_extension.tips_title')}</p>
                        </div>
                        {/* description */}
                        <p className="text-[13px] leading-relaxed text-app-fg-muted">
                            {$t('common.download_extension.desc')}
                        </p>
                        {/* steps */}
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-start gap-2 text-[13px] text-app-fg">
                                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft text-[#1ABC9C] text-[11px] font-bold">1</span>
                                <span className="flex items-center gap-1.5"><Download width={14} height={14} className="text-app-fg-muted" />{$t('common.download_extension.tips_step1')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-[13px] text-app-fg">
                                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft text-[#1ABC9C] text-[11px] font-bold">2</span>
                                <span className="flex items-center gap-1.5"><MousePointerClick width={14} height={14} className="text-app-fg-muted" />{$t('common.download_extension.tips_step2')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-[13px] text-app-fg">
                                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft text-[#1ABC9C] text-[11px] font-bold">3</span>
                                <span className="flex items-center gap-1.5"><BookOpenText width={14} height={14} className="text-app-fg-muted" />{$t('common.download_extension.tips_step3')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-[13px] text-app-fg">
                                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft text-[#1ABC9C] text-[11px] font-bold">4</span>
                                <a href="/extension-guide" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent-strong hover:text-[#1ABC9C] underline underline-offset-2 decoration-accent-strong/40 hover:decoration-[#1ABC9C] transition-colors">
                                    <BookOpenText width={14} height={14} className="shrink-0" />
                                    {$t('common.download_extension.tips_step4')}
                                </a>
                            </li>
                        </ul>
                        {/* action */}
                        <button
                            type="button"
                            onClick={() => { setTipsOpen(false); handleDownloadExtension(); }}
                            className="mt-1 w-full rounded-lg bg-primary text-white text-sm font-medium py-2 hover:brightness-105 active:scale-[0.98] transition-all"
                        >
                            {$t('common.download_extension.tips_action')}
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
