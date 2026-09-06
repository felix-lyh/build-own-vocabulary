"use client";
import { useEffect, useRef, useState } from 'react';
import type { VocabularyDataType } from '@/type/vocabulary';
import PlayVoice from '@/components/play-voice';
import SvgIcon from '@/icons/svg-icon';
import { $t, copyText } from '@/utils/index';
import { speakWithVoice } from '@/utils/tts';
import { playSound } from '@/utils/sounds';

interface PropType {
    words: VocabularyDataType[];
    onExit: () => void;
    onFinish: () => void;
}

export default function MemoryMode({ words, onExit, onFinish }: PropType) {
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const current = words[index]
    const isLast = index === words.length - 1

    const flip = () => {
        playSound('flip')
        setFlipped(f => !f)
    }
    const next = () => {
        if (isLast) {
            onFinish()
            return
        }
        setFlipped(false)
        setIndex(i => i + 1)
    }
    const prev = () => {
        if (index === 0) return
        setFlipped(false)
        setIndex(i => i - 1)
    }

    // keep latest handlers for the global key listener
    const handlersRef = useRef({ flip, next, prev });
    handlersRef.current = { flip, next, prev };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault()
                handlersRef.current.flip()
            } else if (e.key === 'ArrowRight') {
                handlersRef.current.next()
            } else if (e.key === 'ArrowLeft') {
                handlersRef.current.prev()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const progress = Math.round(((index + 1) / words.length) * 100)

    return (
        <div>
            {/* progress bar */}
            <div className="flex items-center gap-4">
                <span onClick={onExit} className="shrink-0 cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-[#E74C3C] hover:border-[#E74C3C]/40 transition-colors" title={$t('common.back')}>
                    <SvgIcon name="next" width={18} className="rotate-180" />
                </span>
                <div className="flex-1 h-2.5 bg-white border border-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#0E8C74] tabular-nums">{index + 1} / {words.length}</span>
            </div>

            {/* flip card */}
            <div className="mt-8 [perspective:1400px] cursor-pointer select-none" onClick={flip}>
                <div className={`relative h-[300px] sm:h-[380px] [transform-style:preserve-3d] transition-transform duration-500 ease-out ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* front: word */}
                    <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl border border-[#1ABC9C]/20 shadow-[0_16px_40px_rgba(26,188,156,0.12)] flex flex-col items-center justify-center p-5 sm:p-8">
                        {
                            current?.SourceWeb &&
                            <a href={current.SourceWeb} target="_blank" onClick={(e) => e.stopPropagation()} className="absolute top-5 left-5 text-[11px] text-[#1ABC9C] bg-[#E6F6F4] rounded-full px-2.5 py-1 hover:bg-[#1ABC9C] hover:text-white transition-colors">{$t('vocabulary_data_source')}</a>
                        }
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#E6F6F4] text-[#1ABC9C] flex items-center justify-center hover:bg-[#1ABC9C] hover:text-white transition-colors">
                            {current?.vocabulary && <PlayVoice needInitVoice={true} voiceValue={current.vocabulary} />}
                        </div>
                        <p className="text-3xl sm:text-4xl font-headline-lg font-black text-zinc-800 text-center break-all leading-snug cursor-context-menu" onClick={(e) => { e.stopPropagation(); copyText(current?.vocabulary || '') }}>
                            {current?.vocabulary}
                        </p>
                        <p className="absolute bottom-6 text-xs text-zinc-400 tracking-wide">{$t('practice.reveal_hint')}</p>
                    </div>
                    {/* back: meaning */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] shadow-[0_16px_40px_rgba(14,140,116,0.30)] flex flex-col items-center justify-center p-5 sm:p-8 text-white overflow-auto">
                        <p className="text-xl sm:text-2xl font-headline-lg font-bold text-center leading-snug break-all cursor-context-menu" onClick={(e) => { e.stopPropagation(); copyText(current?.translations || '') }}>
                            {current?.translations || '—'}
                        </p>
                        {
                            current?.examples &&
                            <p className="mt-5 text-sm text-white/80 italic text-center leading-relaxed max-w-[85%] cursor-pointer" onClick={(e) => { e.stopPropagation(); speakWithVoice(current.examples) }}>
                                {current.examples}
                            </p>
                        }
                        <p className="absolute bottom-6 text-xs text-white/60 tracking-wide">{$t('practice.reveal_hint')}</p>
                    </div>
                </div>
            </div>

            {/* controls */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 sm:mt-8">
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-[#1ABC9C] hover:text-[#1ABC9C] disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all">
                    <SvgIcon name="next" width={22} className="rotate-180" />
                </button>
                <span className="hidden sm:inline text-xs text-zinc-400 tracking-widest">Space · ← →</span>
                <button
                    onClick={next}
                    className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all ${isLast ? 'bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] text-white shadow-md shadow-[#1ABC9C]/30' : 'bg-white border border-zinc-200 text-zinc-500 hover:border-[#1ABC9C] hover:text-[#1ABC9C]'}`}>
                    <SvgIcon name={isLast ? 'completion' : 'next'} width={22} />
                </button>
            </div>
        </div>
    )
}
