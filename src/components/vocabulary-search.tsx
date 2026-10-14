"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, X, Loader2, BookOpenText } from 'lucide-react'
import { $t } from '@/utils/index'
import { searchVocabulary } from '@/request/vocabulary'

type SearchWordType = {
    id?: string
    vocabulary: string
    translations?: string
    examples?: string
    bookId?: string
    chapterId?: string
    bookName?: string
    chapterName?: string
}

/**
 * Expanding search box for the top bar.
 * Scope follows the current route:
 *   /vocabulary                     -> all books
 *   /vocabulary/[bookId]            -> every chapter in that book
 *   /vocabulary/[bookId]/[chapterId]-> only that chapter
 */
export default function VocabularySearch() {
    const pathname = usePathname()
    const router = useRouter()
    const boxRef = useRef<HTMLDivElement>(null)
    const [keyword, setKeyword] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<SearchWordType[]>([])

    // derive the search scope from the url
    const { bookId, chapterId } = useMemo(() => {
        const parts = pathname.split('/').filter(Boolean)
        if (parts[0] !== 'vocabulary') return { bookId: undefined, chapterId: undefined }
        return { bookId: parts[1], chapterId: parts[2] }
    }, [pathname])

    // debounced fuzzy query
    useEffect(() => {
        const text = keyword.trim()
        if (!text) {
            setResults([])
            setLoading(false)
            return
        }
        setLoading(true)
        const timer = setTimeout(() => {
            searchVocabulary({ keyword: text, bookId, chapterId })
                .then((res: any) => setResults(res?.payload || []))
                .catch(() => setResults([]))
                .finally(() => setLoading(false))
        }, 300)
        return () => clearTimeout(timer)
    }, [keyword, bookId, chapterId])

    // dismiss on outside click / Escape
    useEffect(() => {
        const onPointerDown = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    const goToWord = (word: SearchWordType) => {
        if (word.bookId && word.chapterId) {
            router.push(`/vocabulary/${word.bookId}/${word.chapterId}`)
        } else if (word.bookId) {
            router.push(`/vocabulary/${word.bookId}`)
        }
        setKeyword('')
        setResults([])
        setOpen(false)
    }

    // the search box only belongs to the vocabulary pages
    if (!pathname.startsWith('/vocabulary')) return null

    const showPanel = open && !!keyword.trim()

    return (
        <div ref={boxRef} className="relative shrink-0">
            <div
                className="flex items-center gap-2 h-10 rounded-lg border bg-surface px-2.5 md:px-3 transition-all duration-300 ease-out w-[120px] md:w-[200px] border-app-border hover:border-[#1ABC9C]/50 focus-within:w-[190px] md:focus-within:w-[340px] focus-within:border-[#1ABC9C] focus-within:shadow-[0_0_0_3px_rgba(26,188,156,0.12)]"
            >
                {loading
                    ? <Loader2 width={16} height={16} className="shrink-0 text-[#1ABC9C] animate-spin" />
                    : <Search width={16} height={16} className="shrink-0 text-app-fg-muted" />}
                <input
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setOpen(true) }}
                    onClick={() => setOpen(true)}
                    placeholder={$t('common.search_placeholder')}
                    className="flex-1 min-w-0 bg-transparent text-sm text-app-fg placeholder:text-app-fg-muted outline-none"
                />
                {!!keyword && (
                    <button
                        type="button"
                        onClick={() => { setKeyword(''); setResults([]) }}
                        className="shrink-0 text-app-fg-muted hover:text-app-fg transition-colors"
                    >
                        <X width={14} height={14} />
                    </button>
                )}
            </div>

            {showPanel && (
                <div className="absolute right-0 top-12 z-50 w-[300px] md:w-[380px] max-h-[420px] overflow-y-auto rounded-xl border border-app-border bg-surface shadow-xl p-2">
                    {loading && results.length === 0 && (
                        <p className="px-3 py-4 text-center text-sm text-app-fg-muted">{$t('vocabulary_search.searching')}</p>
                    )}
                    {!loading && results.length === 0 && (
                        <p className="px-3 py-4 text-center text-sm text-app-fg-muted">{$t('vocabulary_search.empty')}</p>
                    )}
                    {results.length > 0 && (
                        <ul className="flex flex-col gap-0.5">
                            {results.map((word, index) => (
                                <li key={word.id || index}>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => goToWord(word)}
                                        className="w-full text-left rounded-lg px-3 py-2 hover:bg-surface-muted transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-sm text-app-fg truncate">{word.vocabulary}</span>
                                            {(word.bookName || word.chapterName) && (
                                                <span className="shrink-0 flex items-center gap-1 max-w-[50%] text-[11px] text-app-fg-muted">
                                                    <BookOpenText width={12} height={12} className="shrink-0" />
                                                    <span className="truncate">
                                                        {[word.bookName, word.chapterName].filter(Boolean).join(' · ')}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        {!!word.translations && (
                                            <p className="mt-0.5 text-[13px] text-accent-strong truncate">{word.translations}</p>
                                        )}
                                        {!!word.examples && (
                                            <p className="mt-0.5 text-[12px] text-app-fg-muted italic truncate">{word.examples}</p>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
