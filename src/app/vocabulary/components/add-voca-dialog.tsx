"use client";
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog"
import { addVocabulary } from '@/request/vocabulary'
import { $t } from '@/utils/index';
interface PropType {
    dialogVisible:boolean,
    bookId:string,
    chapterId:string,
    callbackData:Function,
    handleDialogVisible:Function
}

export default function addVocaDialog({dialogVisible,bookId,chapterId,callbackData,handleDialogVisible}:PropType) {
    
    const [vocaData, setVocaData] = useState({
        vocabulary: '',
        translations: '',
        examples: ''
    })
    const firstInputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (event: any) => {
        if (!vocaData.vocabulary) return
        event.preventDefault();
        setVocaData({
            vocabulary: '',
            translations: '',
            examples: ''
        })
        let query = { ...vocaData, bookId,chapterId }
        addVocabulary(query).then((res:any) => {
            firstInputRef.current?.focus()
            callbackData(res?.payload)
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
                        <label>{$t('collect_words.vocabulary')}</label>
                        <Input ref={firstInputRef} value={vocaData.vocabulary} onChange={(e: any) =>
                            setVocaData((prev) => ({
                                ...prev,
                                vocabulary: e.target.value,
                            }))
                        } className='flex-1 ml-[15px]' placeholder={$t('collect_words.vocabulary')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('collect_words.examples')}</label>
                        <Input onChange={(e: any) =>
                            setVocaData((prev) => ({
                                ...prev,
                                examples: e.target.value,
                            }))
                        } value={vocaData.examples} className='flex-1 ml-[15px]' placeholder={$t('collect_words.examples_ph')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('collect_words.translation')}</label>
                        <Input onChange={(e: any) =>
                            setVocaData((prev) => ({
                                ...prev,
                                translations: e.target.value,
                            }))
                        } value={vocaData.translations} className='flex-1 ml-[15px]' placeholder={$t('collect_words.translation_ph')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <DialogClose asChild>
                            <Button type="button">{$t('common.close')}</Button>
                        </DialogClose>
                        <Button className='ml-[20px]' disabled={!vocaData.vocabulary} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
