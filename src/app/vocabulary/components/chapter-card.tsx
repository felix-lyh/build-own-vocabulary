"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SvgIcon from "@/icons/svg-icon";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog";

import type { BookChapterType } from '@/type/chapter'
import { updateChapter } from '@/request/vocabulary'

import { $t } from '@/utils/index'
interface ChapterCardProps extends BookChapterType {
    callback?: (p: string) => void
    isEditState?: boolean
    isChecked?: boolean
    onSelectChange?: (chapterId: string, checked: boolean) => void
    onUpdate?: () => void
}

export default function ChapterCard({ bookId, chapterId, chapterName, chapterDesc, callback, isEditState = false, isChecked = false, onSelectChange, onUpdate }: ChapterCardProps) {
    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [draft, setDraft] = useState({ chapterName, chapterDesc })
    const firstInputRef = useRef<HTMLInputElement>(null)

    const openEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDraft({ chapterName, chapterDesc })
        setEditOpen(true)
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draft.chapterName.trim()) return
        updateChapter({ bookId, chapterId, chapterName: draft.chapterName.trim(), chapterDesc: draft.chapterDesc.trim() })
            .then(() => {
                onUpdate && onUpdate()
                setEditOpen(false)
            })
    }

    const handleCardClick = () => {
        if (!isEditState) router.push(`/vocabulary/${bookId}/${chapterId}`)
    }

    return (
        <div className="group bg-surface rounded-2xl p-5 shadow-[0_2px_10px_rgba(29,43,41,0.04)] border border-app-border hover:shadow-[0_12px_28px_rgba(26,188,156,0.14)] hover:border-[#1ABC9C]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 w-full cursor-pointer" onClick={handleCardClick}>
            {isEditState &&
                <span className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isChecked} onCheckedChange={(checked) => { e.stopPropagation(); onSelectChange && onSelectChange(chapterId, checked === true); }} />
                </span>
            }
            <div className="shrink-0 rounded-2xl w-12 h-12 bg-gradient-to-br from-accent-soft to-accent-soft/60 flex items-center justify-center group-hover:from-[#1ABC9C] group-hover:to-[#0E8C74] transition-all duration-300">
                <span className="text-[#1ABC9C] group-hover:text-white transition-colors">
                    <SvgIcon name="vocabulary" width={22} />
                </span>
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-headline-lg text-lg font-bold text-app-fg truncate">{chapterName}</h3>
                {chapterDesc && <p className="text-xs text-app-fg-muted mt-0.5 truncate">{chapterDesc}</p>}
            </div>
            <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()} >
                <Popover>
                    <PopoverTrigger asChild>
                        <span className='flex justify-center items-center cursor-pointer p-[8px] ml-auto text-app-fg-muted hover:bg-theme hover:text-[#fff] rounded-[6px] transition-colors' onClick={(e) => e.stopPropagation()}><SvgIcon name="more" /></span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit py-[6px] px-0" onClick={(e) => e.stopPropagation()}>
                        <ul>
                            <li className='cursor-pointer px-[10px] py-1 hover:bg-theme hover:text-[#fff]'
                                onClick={openEdit}>{$t('edit_btn')}</li>
                            <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]'
                            onClick={(e) => { e.stopPropagation(); callback && callback(chapterId); }}>{$t('delete_btn')}</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <form onSubmit={handleEditSubmit}>
                        <div className='flex items-center mt-[20px]' onClick={(e) => e.stopPropagation()}>
                            <label>{$t('book_chapter.title')}</label>
                            <Input ref={firstInputRef} value={draft.chapterName} onChange={(e) =>
                                setDraft((prev) => ({ ...prev, chapterName: e.target.value }))
                            } className='flex-1 ml-[15px]' placeholder={$t('book_chapter.title')} />
                        </div>
                        <div className='flex items-center mt-[20px]' onClick={(e) => e.stopPropagation()}>
                            <label>{$t('book_chapter.desc')}</label>
                            <Input value={draft.chapterDesc} onChange={(e) =>
                                setDraft((prev) => ({ ...prev, chapterDesc: e.target.value }))
                            } className='flex-1 ml-[15px]' placeholder={$t('book_chapter.desc')} />
                        </div>
                        <div className='flex justify-end mt-[20px]' onClick={(e) => e.stopPropagation()}>
                            <DialogClose asChild>
                                <Button type="button" onClick={(e) => e.stopPropagation()}>{$t('common.close')}</Button>
                            </DialogClose>
                            <Button className='ml-[20px]' disabled={!draft.chapterName.trim()} type='submit' onClick={(e) => e.stopPropagation()}>{$t('common.save')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
