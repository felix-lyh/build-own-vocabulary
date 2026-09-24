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
import { $t } from '@/utils/index';

interface PropType {
    dialogVisible:boolean,
    callbackData:Function,
    handleDialogVisible:Function
}
export default function addDialog({dialogVisible,callbackData,handleDialogVisible}:PropType) {
    const [fromData, setChapter] = useState({
        name:'',
        desc:''
    })
    const firstInputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (event: any) => {
        event.preventDefault();
        
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
                        <label>{$t('common.name')}</label>
                        <Input ref={firstInputRef} value={fromData.name} onChange={(e: any) =>
                            setChapter((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        } className='flex-1 ml-[15px]' placeholder={$t('book_chapter.title')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('common.desc')}</label>
                        <Input onChange={(e: any) =>
                            setChapter((prev) => ({
                                ...prev,
                                desc: e.target.value,
                            }))
                        } value={fromData.desc} className='flex-1 ml-[15px]' placeholder={$t('book_chapter.desc')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <DialogClose asChild>
                            <Button type="button">{$t('common.close')}</Button>
                        </DialogClose>
                        <Button className='ml-[20px]' disabled={!fromData.name} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
