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
import { speakWithVoice } from '@/utils/tts';
interface PropType {
    dialogVisible: boolean,
    bookId: string,
    chapterId: string,
    callbackData: Function,
    handleDialogVisible: Function
}

export default function addVocaDialog({ dialogVisible, bookId, chapterId, callbackData, handleDialogVisible }: PropType) {

    const [vocaData, setVocaData] = useState({
        vocabulary: '',
        translations: '',
        definitions: [] as string[],
        examples: ''
    })
    const firstInputRef = useRef<HTMLInputElement>(null)

    const handleAddDefinition = () => {
        setVocaData(prev => ({ ...prev, definitions: [...prev.definitions, ''] }))
    }
    const handleRemoveDefinition = (idx: number) => {
        setVocaData(prev => ({ ...prev, definitions: prev.definitions.filter((_, i) => i !== idx) }))
    }
    const handleDefinitionChange = (idx: number, value: string) => {
        setVocaData(prev => ({
            ...prev,
            definitions: prev.definitions.map((d, i) => i === idx ? value : d)
        }))
    }

    const handleSubmit = (event: any) => {
        if (!vocaData.vocabulary) return
        event.preventDefault();
        // Filter out empty definitions
        const definitions = vocaData.definitions.map(d => d.trim()).filter(Boolean)
        const query = { ...vocaData, definitions, bookId, chapterId }
        setVocaData({
            vocabulary: '',
            translations: '',
            definitions: [],
            examples: ''
        })
        addVocabulary(query).then((res: any) => {
            firstInputRef.current?.focus()
            callbackData(res?.payload)
            if (query.vocabulary) speakWithVoice(query.vocabulary)
        })
    };
    const handleOpenChange = (value: boolean) => {
        handleDialogVisible(value)
        if (!value) {
            // reset on close
            setVocaData({ vocabulary: '', translations: '', definitions: [], examples: '' })
        }
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

                    {/* definitions */}
                    <div className='mt-[20px]'>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-sm font-medium'>{$t('collect_words.definitions')}</label>
                            <button
                                type="button"
                                onClick={handleAddDefinition}
                                className='text-[12px] text-[#1ABC9C] hover:text-[#0E8C74] font-medium inline-flex items-center gap-1'
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                {$t('add_definition')}
                            </button>
                        </div>
                        {vocaData.definitions.length === 0 ? (
                            <p className='text-[12px] text-app-fg-muted italic'>{$t('no_definitions_hint')}</p>
                        ) : (
                            <div className='space-y-2'>
                                {vocaData.definitions.map((def, idx) => (
                                    <div key={idx} className='flex items-center gap-2'>
                                        <span className='shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1ABC9C]/15 text-[#1ABC9C] text-[11px] font-semibold'>
                                            {idx + 1}
                                        </span>
                                        <Input
                                            value={def}
                                            onChange={(e) => handleDefinitionChange(idx, e.target.value)}
                                            className='flex-1'
                                            placeholder={`${$t('collect_words.definitions')} ${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDefinition(idx)}
                                            className='shrink-0 text-app-fg-muted hover:text-red-500 transition-colors p-1'
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
