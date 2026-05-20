"use client";
import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BookChapterType,UpsertChapterType } from '@/type/chapter'
import { addChapter } from '@/request/chapter'
import { $t } from '@/utils/index';

interface PropType {
    dialogVisible:boolean,
    bookId:string,
    callbackData:Function,
    handleDialogVisible:Function
}
export default function addChapterDialog({dialogVisible,bookId,callbackData,handleDialogVisible}:PropType) {
    const [chapter, setChapter] = useState({
        chapterName:'',
        chapterDesc:''
    })
    const firstInputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (event: any) => {
        event.preventDefault();
        addChapter({...chapter, bookId}).then((res:any)=>{
            let data:BookChapterType = res?.payload
            callbackData(data)
        }).finally(()=>{
            setChapter({
                chapterName:'',
                chapterDesc:''
            })
            handleDialogVisible(false)
        })
    };
    const handleOpenChange = (value: boolean) => {
        handleDialogVisible(value)
    }
    return (
        <Dialog open={dialogVisible} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('book_chapter.title')}</label>
                        <Input ref={firstInputRef} value={chapter.chapterName} onChange={(e: any) =>
                            setChapter((prev) => ({
                                ...prev,
                                chapterName: e.target.value,
                            }))
                        } className='flex-1 ml-[15px]' placeholder={$t('book_chapter.title')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('book_chapter.desc')}</label>
                        <Input onChange={(e: any) =>
                            setChapter((prev) => ({
                                ...prev,
                                chapterDesc: e.target.value,
                            }))
                        } value={chapter.chapterDesc} className='flex-1 ml-[15px]' placeholder={$t('book_chapter.desc')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <DialogClose asChild>
                            <Button type="button">{$t('common.close')}</Button>
                        </DialogClose>
                        <Button className='ml-[20px]' disabled={!chapter.chapterName} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
