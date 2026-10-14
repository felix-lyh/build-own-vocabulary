"use client"
import { $t } from '@/utils/index';
import Logo from '@/components/logo';
import { Download, FolderOpen, ToggleRight, PackagePlus, Pin, MousePointerClick } from 'lucide-react';
import { useRouter } from 'next/navigation';

type GuideStep = {
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
    imgPrompt: string;
    alt: string;
};

const IMG = (prompt: string) =>
    `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`;

export default function ExtensionGuidePage() {
    const router = useRouter();
    const steps: GuideStep[] = [
        {
            icon: <Download width={18} height={18} />,
            titleKey: 'extension_guide.step1_title',
            descKey: 'extension_guide.step1_desc',
            imgPrompt: 'clean minimal UI illustration, a teal download button on a modern web app sidebar, flat design, soft shadows, light background, no text',
            alt: 'download extension',
        },
        {
            icon: <FolderOpen width={18} height={18} />,
            titleKey: 'extension_guide.step2_title',
            descKey: 'extension_guide.step2_desc',
            imgPrompt: 'Chrome browser address bar close-up illustration showing chrome://extensions typed in, minimal flat UI, light theme, soft teal accents, no real text',
            alt: 'open extensions page',
        },
        {
            icon: <ToggleRight width={18} height={18} />,
            titleKey: 'extension_guide.step3_title',
            descKey: 'extension_guide.step3_desc',
            imgPrompt: 'Chrome extensions management page illustration, developer mode toggle switch highlighted in top right corner, flat minimal UI, light background, teal accent, no real text',
            alt: 'enable developer mode',
        },
        {
            icon: <PackagePlus width={18} height={18} />,
            titleKey: 'extension_guide.step4_title',
            descKey: 'extension_guide.step4_desc',
            imgPrompt: 'Chrome extensions page with a "Load unpacked" button highlighted, a folder being selected, flat minimal UI illustration, light background, teal accent, no real text',
            alt: 'load unpacked extension',
        },
        {
            icon: <Pin width={18} height={18} />,
            titleKey: 'extension_guide.step5_title',
            descKey: 'extension_guide.step5_desc',
            imgPrompt: 'Chrome toolbar puzzle extensions icon with a pin, one extension pinned to the toolbar, flat minimal UI illustration, light background, teal accent, no real text',
            alt: 'pin extension to toolbar',
        },
        {
            icon: <MousePointerClick width={18} height={18} />,
            titleKey: 'extension_guide.step6_title',
            descKey: 'extension_guide.step6_desc',
            imgPrompt: 'web page with a word selected and highlighted, a small teal extension popup saving the word to a vocabulary book, flat minimal UI illustration, light background, no real text',
            alt: 'use extension to save words',
        },
    ];
    return (
        <div className="min-h-[100vh] bg-app-bg text-app-fg">
            {/* header */}
            <div className="sticky top-0 z-10 bg-surface border-b border-app-border">
                <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
                    <button onClick={() => router.back()} className="text-sm text-app-fg-muted hover:text-accent-strong transition-colors">
                        {$t('extension_guide.back')}
                    </button>
                    <div className="h-5 w-px bg-app-border"></div>
                    <Logo></Logo>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* title block */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-app-fg">{$t('extension_guide.title')}</h1>
                    <p className="mt-2 text-app-fg-muted">{$t('extension_guide.subtitle')}</p>
                </div>

                {/* steps */}
                <ol className="flex flex-col gap-10">
                    {steps.map((step, i) => (
                        <li key={step.titleKey} className="bg-surface border border-app-border rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(29,43,41,0.04)]">
                            <div className="flex items-start gap-4 p-6">
                                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-accent-soft text-[#1ABC9C] font-bold">
                                    {step.icon}
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-semibold text-app-fg">
                                        <span className="text-accent-strong mr-2">{i + 1}.</span>
                                        {$t(step.titleKey)}
                                    </h2>
                                    <p className="mt-1.5 text-sm leading-relaxed text-app-fg-muted">{$t(step.descKey)}</p>
                                </div>
                            </div>
                            <div className="px-6 pb-6">
                                <img
                                    src={IMG(step.imgPrompt)}
                                    alt={step.alt}
                                    loading="lazy"
                                    className="w-full rounded-xl border border-app-border bg-surface-muted object-cover"
                                />
                            </div>
                        </li>
                    ))}
                </ol>
            </main>
        </div>
    );
}
