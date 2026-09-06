"use client";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import HeaderBar from '@/components/header-bar';
import BackBtn from '@/components/back-btn';
import SvgIcon from '@/icons/svg-icon';
import { getVocabularyList } from '@/request/vocabulary';
import type { VocabularyDataType } from '@/type/vocabulary';
import { $t } from '@/utils/index';
import MemoryMode from './components/memory-mode';
import TypingMode from './components/typing-mode';

type Stage = 'select' | 'memory' | 'typing' | 'done';

interface PracticeStats {
    correct: number;
    wrong: number;
    total: number;
}

export default function PracticePage() {
    return (
        <Suspense fallback={
            <div className="min-h-[100vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1ABC9C]/20 border-t-[#1ABC9C] rounded-full animate-spin"></div>
            </div>
        }>
            <PracticeContent />
        </Suspense>
    )
}

function PracticeContent() {
    const searchParams = useSearchParams()
    const bookId = searchParams.get('bookId') || ''
    const chapterId = searchParams.get('chapterId') || ''

    const backPath = chapterId
        ? `/vocabulary/${bookId}/${chapterId}`
        : bookId ? `/vocabulary/${bookId}` : '/vocabulary'

    const [words, setWords] = useState<VocabularyDataType[]>([])
    const [loading, setLoading] = useState(true)
    const [stage, setStage] = useState<Stage>('select')
    const [sessionWords, setSessionWords] = useState<VocabularyDataType[]>([])
    const [stats, setStats] = useState<PracticeStats>({ correct: 0, wrong: 0, total: 0 })
    const [practiceMode, setPracticeMode] = useState<'memory' | 'typing'>('memory')

    useEffect(() => {
        getVocabularyList({ bookId, chapterId, limit: 0, page: 1 }).then((res: any) => {
            const list: VocabularyDataType[] = (res?.payload || []).filter((item: VocabularyDataType) => item.vocabulary && item.vocabulary.trim())
            setWords(list)
        }).catch(() => {
            setWords([])
        }).finally(() => {
            setLoading(false)
        })
    }, [bookId, chapterId])

    // Fisher-Yates shuffle so every practice session has a fresh order
    const shuffleWords = (list: VocabularyDataType[]) => {
        const arr = [...list]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }

    const startPractice = (mode: 'memory' | 'typing') => {
        setPracticeMode(mode)
        setSessionWords(shuffleWords(words))
        setStats({ correct: 0, wrong: 0, total: words.length })
        setStage(mode)
    }

    const handleFinish = (result?: PracticeStats) => {
        if (result) setStats(result)
        setStage('done')
    }

    const handleAgain = () => {
        setStage('select')
    }

    return (
        <div className="min-h-[100vh] bg-gradient-to-b from-[#F5F5F5] via-[#F5F5F5] to-[#E6F6F4]/60">
            <HeaderBar
                leftContent={<BackBtn path={backPath}></BackBtn>}
                rightContent={
                    <span className="inline-flex items-center gap-1.5 bg-[#E6F6F4] text-[#0E8C74] rounded-full px-3 py-1 text-xs font-bold">
                        <SvgIcon name="vocabulary" width={14} />
                        {words.length} {$t('words')}
                    </span>
                }
            >
            </HeaderBar>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {
                    loading ?
                        <div className="flex items-center justify-center h-[50vh]">
                            <div className="w-10 h-10 border-4 border-[#1ABC9C]/20 border-t-[#1ABC9C] rounded-full animate-spin"></div>
                        </div>
                        : words.length === 0 ?
                            <div className="mt-[80px] bg-white/60 border-2 border-dashed border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center p-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#E6F6F4] flex items-center justify-center mb-4">
                                    <SvgIcon width={30} name="vocabulary" color="#2EB7A3" />
                                </div>
                                <h3 className="font-headline-lg font-bold text-on-surface mb-2">{$t('vocabulary_empty')}</h3>
                                <p className="text-on-surface-variant text-sm">{$t('add_vocabulary_book_desc')}</p>
                            </div>
                            : stage === 'select' ?
                                <ModeSelect wordsCount={words.length} onStart={startPractice} />
                                : stage === 'memory' ?
                                    <MemoryMode words={sessionWords} onExit={handleAgain} onFinish={() => handleFinish()} />
                                    : stage === 'typing' ?
                                        <TypingMode words={sessionWords} onExit={handleAgain} onFinish={handleFinish} />
                                        :
                                        <DoneScreen stats={stats} mode={practiceMode} onAgain={handleAgain} />
                }
            </div>
        </div>
    )
}

function ModeSelect({ wordsCount, onStart }: { wordsCount: number, onStart: (mode: 'memory' | 'typing') => void }) {
    const modes = [
        {
            key: 'memory' as const,
            icon: 'viewIcon' as const,
            title: $t('practice.memory_mode'),
            desc: $t('practice.memory_mode.desc'),
            gradient: 'from-[#1ABC9C] to-[#0E8C74]',
        },
        {
            key: 'typing' as const,
            icon: 'edit' as const,
            title: $t('practice.typing_mode'),
            desc: $t('practice.typing_mode.desc'),
            gradient: 'from-[#3498DB] to-[#21618C]',
        },
    ]
    return (
        <div>
            <div className="text-center mb-10 mt-2">
                <h2 className="text-2xl font-headline-lg font-bold text-zinc-800">{$t('practice.start')}</h2>
                <p className="text-sm text-zinc-400 mt-2">{$t('init_page_banner.title')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {modes.map(mode => (
                    <div key={mode.key}
                        onClick={() => onStart(mode.key)}
                        className="group bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 text-center cursor-pointer shadow-[0_2px_10px_rgba(29,43,41,0.04)] hover:shadow-[0_16px_36px_rgba(26,188,156,0.16)] hover:border-[#1ABC9C]/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${mode.gradient} shadow-lg shadow-[#1ABC9C]/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                            <SvgIcon name={mode.icon} width={30} color="#fff" />
                        </div>
                        <h3 className="mt-5 font-headline-lg text-lg font-bold text-zinc-800">{mode.title}</h3>
                        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{mode.desc}</p>
                        <span className="inline-block mt-5 text-xs font-bold text-[#1ABC9C] bg-[#E6F6F4] rounded-full px-4 py-1.5 group-hover:bg-[#1ABC9C] group-hover:text-white transition-colors">
                            {wordsCount} {$t('words')} →
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DoneScreen({ stats, mode, onAgain }: { stats: PracticeStats, mode: 'memory' | 'typing', onAgain: () => void }) {
    const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0
    return (
        <div className="bg-white rounded-3xl border border-[#1ABC9C]/20 shadow-[0_16px_40px_rgba(26,188,156,0.10)] p-6 sm:p-10 text-center mt-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] shadow-lg shadow-[#1ABC9C]/30 flex items-center justify-center">
                <SvgIcon name="completion" width={40} color="#fff" />
            </div>
            <h2 className="mt-6 text-2xl font-headline-lg font-bold text-zinc-800">{$t('practice.complete.title')}</h2>
            {
                mode === 'typing' ?
                    <div className="mt-8 flex justify-center gap-8 sm:gap-12">
                        <div>
                            <p className="text-3xl font-black text-[#1ABC9C]">{accuracy}%</p>
                            <p className="text-xs text-zinc-400 mt-1">{$t('practice.complete.accuracy')}</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#2ECC71]">{stats.correct}</p>
                            <p className="text-xs text-zinc-400 mt-1">{$t('practice.correct')}</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#E74C3C]">{stats.wrong}</p>
                            <p className="text-xs text-zinc-400 mt-1">{$t('practice.wrong')}</p>
                        </div>
                    </div>
                    :
                    <p className="mt-4 text-sm text-zinc-500">{$t('practice.complete.viewed')}: <span className="font-bold text-[#1ABC9C]">{stats.total}</span></p>
            }
            <button onClick={onAgain}
                className="mt-9 bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] text-white rounded-xl px-7 py-2.5 text-sm font-medium shadow-md shadow-[#1ABC9C]/30 hover:brightness-105 hover:shadow-lg active:scale-95 transition-all">
                {$t('practice.again')}
            </button>
        </div>
    )
}
