'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { $t } from '@/utils/index';
import HeaderBar from '@/components/header-bar';
import BackBtn from '@/components/back-btn';
import { getWork, updateWork } from '@/request/writing';
import type { WorkType } from '@/type/writing'
import { useParams } from 'next/navigation';

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved'

export default function Page() {
    const params = useParams()
    const workId = params.workId as string
    const [work, setWork] = useState<WorkType | null>(null)
    const [content, setContent] = useState('')
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
    const [savedAt, setSavedAt] = useState<number>(0)
    const contentRef = useRef(content)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    contentRef.current = content

    const handleSave = useCallback(() => {
        if (saveStatus === 'saving') return
        setSaveStatus('saving')
        updateWork(workId, { content: contentRef.current }).then(() => {
            setSaveStatus('saved')
            setSavedAt(Date.now())
        }).catch(() => {
            setSaveStatus('dirty')
        })
    }, [workId, saveStatus])

    // Ctrl+S / Cmd+S to save
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleSave])

    useEffect(() => {
        getWork(workId).then((res: any) => {
            const work = res?.payload || null
            setWork(work)
            setContent(work?.content || '')
            textareaRef.current?.focus()
        }).catch(() => {

        })
    }, [workId])

    const handleContentChange = (value: string) => {
        setContent(value)
        setSaveStatus('dirty')
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    const statusText: Record<SaveStatus, string> = {
        idle: '',
        dirty: $t('writing.editor.unsaved'),
        saving: $t('writing.editor.saving'),
        saved: $t('writing.editor.saved'),
    }

    return (
        <>
            <HeaderBar
                needLogo={true}
                leftContent={<BackBtn path='/writing'></BackBtn>}
                rightContent={
                    <div className='flex items-center gap-4'>
                        <span className={`text-xs ${saveStatus === 'saved' ? 'text-[#0E8C74]' : saveStatus === 'dirty' ? 'text-amber-500' : 'text-zinc-400'}`}>
                            {statusText[saveStatus]}
                            {saveStatus === 'saved' && savedAt ? ` ${new Date(savedAt).toLocaleTimeString()}` : ''}
                        </span>
                        <span
                            onClick={handleSave}
                            className='bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer shadow-md shadow-[#8B5CF6]/30 hover:brightness-105 active:scale-95 transition-all'
                        >
                            {$t('common.save')} (Ctrl+S)
                        </span>
                    </div>
                }
            >
            </HeaderBar>
            <div className='w-[85%] max-w-[900px] mx-auto py-[24px] h-[calc(100vh-100px)] flex flex-col'>
                <div className='flex items-end justify-between mb-3'>
                    <div className='min-w-0'>
                        <h2 className='font-headline-lg text-xl font-bold text-on-surface truncate'>{work?.workName}</h2>
                        {work?.workDesc && <p className='text-sm text-zinc-500 mt-0.5 truncate'>{work.workDesc}</p>}
                    </div>
                    <span className='text-xs text-zinc-400 shrink-0 ml-4'>{wordCount} {$t('writing.words')}</span>
                </div>
                <div className='flex-1 bg-white rounded-2xl border border-zinc-100 shadow-[0_4px_12px_rgba(29,43,41,0.06)] overflow-hidden flex flex-col'>
                    <div className='h-[6px] w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] shrink-0'></div>
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder={$t('writing.editor.placeholder')}
                        className='flex-1 w-full resize-none outline-none p-6 text-[15px] leading-7 text-on-surface placeholder:text-zinc-300 bg-transparent'
                    ></textarea>
                </div>
            </div>
        </>
    );
}
