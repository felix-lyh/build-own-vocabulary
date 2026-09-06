"use client";
import { useEffect, useRef, useState } from 'react';
import type { VocabularyDataType } from '@/type/vocabulary';
import SvgIcon from '@/icons/svg-icon';
import { Input } from '@/components/ui/input';
import { $t } from '@/utils/index';
import { speakWithVoice } from '@/utils/tts';
import { playSound, playTypeSound } from '@/utils/sounds';

interface PropType {
    words: VocabularyDataType[];
    onExit: () => void;
    onFinish: (stats: { correct: number; wrong: number; total: number }) => void;
}

// ignore case/punctuation/extra spaces when comparing answers
const normalize = (s: string) => (s || '')
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"()\/\\。，！？；：、“”‘’]/g, '')
    .replace(/\s+/g, ' ')

type Status = 'idle' | 'correct' | 'wrong'

export default function TypingMode({ words, onExit, onFinish }: PropType) {
    const [index, setIndex] = useState(0)
    const [value, setValue] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [revealAnswer, setRevealAnswer] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const current = words[index]
    const isLast = index === words.length - 1

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    useEffect(() => {
        inputRef.current?.focus()
    }, [index])

    const goNext = (nextCorrect: number, nextWrong: number) => {
        if (isLast) {
            onFinish({ correct: nextCorrect, wrong: nextWrong, total: words.length })
            return
        }
        setIndex(i => i + 1)
        setValue('')
        setStatus('idle')
        setRevealAnswer(false)
    }

    const handleSubmit = () => {
        if (status !== 'idle' || !current) return
        const answer = normalize(value)
        if (!answer) return
        if (answer === normalize(current.vocabulary)) {
            playSound('correct')
            setStatus('correct')
            const nc = correctCount + 1
            setCorrectCount(nc)
            timerRef.current = setTimeout(() => goNext(nc, wrongCount), 900)
        } else {
            playSound('error')
            setStatus('wrong')
            setRevealAnswer(true)
            const nw = wrongCount + 1
            setWrongCount(nw)
            timerRef.current = setTimeout(() => goNext(correctCount, nw), 2000)
        }
    }

    const handleSkip = () => {
        if (status !== 'idle' || !current) return
        playSound('error')
        setRevealAnswer(true)
        const nw = wrongCount + 1
        setWrongCount(nw)
        timerRef.current = setTimeout(() => goNext(correctCount, nw), 1400)
    }

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

            {/* prompt card */}
            <div className={`bg-white rounded-3xl border p-5 sm:p-8 mt-6 sm:mt-8 transition-all duration-300 ${status === 'correct'
                ? 'border-[#2ECC71]/50 shadow-[0_16px_40px_rgba(46,204,113,0.15)]'
                : status === 'wrong'
                    ? 'border-[#E74C3C]/50 shadow-[0_16px_40px_rgba(231,76,60,0.15)]'
                    : 'border-[#1ABC9C]/20 shadow-[0_16px_40px_rgba(26,188,156,0.12)]'}`}>
                <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">{$t('translation')}</p>
                <p className="text-2xl font-headline-lg font-bold text-[#0E8C74] leading-snug break-words">
                    {current?.translations || '—'}
                </p>
                {
                    !!current?.examples &&
                    <p className="mt-4 text-sm text-zinc-500 italic border-l-[3px] border-[#1ABC9C]/30 pl-3 leading-relaxed break-words cursor-pointer" onClick={() => speakWithVoice(current.examples)}>
                        {current.examples}
                    </p>
                }

                {/* answer input */}
                <div className="mt-8">
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => { if (status === 'idle') { setValue(e.target.value); playTypeSound() } }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                        disabled={status !== 'idle'}
                        placeholder={$t('practice.input_ph')}
                        className={`h-12 text-lg text-center tracking-wide rounded-xl ${status === 'correct' ? 'border-[#2ECC71] focus-visible:ring-[#2ECC71]' : status === 'wrong' ? 'border-[#E74C3C] focus-visible:ring-[#E74C3C]' : 'focus-visible:ring-[#1ABC9C]'}`}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                    {
                        status === 'correct' &&
                        <p className="mt-3 text-sm font-bold text-[#2ECC71] flex items-center justify-center gap-1.5 animate-pulse">
                            <SvgIcon name="completion" width={16} />
                            {$t('practice.correct')}
                        </p>
                    }
                    {
                        revealAnswer && status !== 'correct' &&
                        <p className="mt-3 text-sm font-bold text-[#E74C3C] text-center">
                            {$t('practice.correct_answer')}: <span className="text-zinc-800 tracking-wide">{current?.vocabulary}</span>
                        </p>
                    }
                </div>
            </div>

            {/* footer actions */}
            <div className="flex items-center justify-center mt-6">
                {
                    status === 'idle' &&
                    <button onClick={handleSkip} className="text-sm text-zinc-400 hover:text-[#E74C3C] px-4 py-2 rounded-lg hover:bg-white transition-colors">
                        {$t('practice.skip')} →
                    </button>
                }
            </div>
        </div>
    )
}
