"use client";
import SvgIcon from "@/icons/svg-icon";
import { useState } from "react";
import PlayVoice from "@/components/play-voice";
import type { VocabularyDataType } from '@/type/vocabulary'
import {$t, copyText } from '@/utils/index'
interface PropType extends VocabularyDataType{
    onNextFun: Function;
    notNext: boolean;
    onPrevFun: Function;
    notPrev: boolean;
}
export default function MemoryCard(modelValue: PropType) {
    const [isview, setIsview] = useState(false)
    const [isShowTrans, setShowTrans] = useState(false)
    const nextWord = () => {
        setShowTrans(false)
        setIsview(false)
        modelValue.onNextFun()
    }
    const prevWord = () => {
        setShowTrans(false)
        setIsview(false)
        modelValue.onPrevFun()
    }
    const handleViewBtn = ()=>{
        setIsview((state)=>!state)
        setShowTrans((state)=>!state)
    }
    return (
        <div className="flex flex-col justify-between bg-primary/30 min-w-[30%] max-w-[80%] min-h-[80%] max-h-[100%] overflow-auto text-center group w-fit shadow-lg rounded-md p-[10px]">
            <div className="flex items-center justify-end">
                {modelValue.SourceWeb && <a href={modelValue.SourceWeb} target="_blank" className="underline mr-[10px] text-[#409EFF] text-[12px]">{$t('vocabulary_data_source')}</a>}
                <span className="mr-[15px] cursor-pointer" onClick={handleViewBtn}>
                    { isview ? <SvgIcon width={20} name="viewIcon"/> : <SvgIcon width={20} name="noViewIcon"/> }
                </span>
                { modelValue.vocabulary && <PlayVoice voiceValue={modelValue.vocabulary} /> }
            </div>
            <div className="text-[18px] cursor-context-menu" onClick={()=>copyText(modelValue.vocabulary)}>
                {modelValue.vocabulary}
            </div>
            <div onClick={()=>copyText(modelValue.translations)} className={`${isShowTrans ? 'visible' : 'invisible'} mt-[15px] cursor-copy`} >
                {modelValue.translations}
            </div>
            <div onClick={()=>copyText(modelValue.examples)} className={`${isShowTrans ? 'visible' : 'invisible'} mt-[15px] cursor-copy`} >
                {modelValue.examples}
            </div>
            <div className="flex justify-between items-center mt-[15px]">
                <span className={`${modelValue.notPrev ? 'cursor-not-allowed opacity-[0.3]' : 'cursor-pointer'} transform rotate-180`} onClick={prevWord}><SvgIcon name="next" color="#000" width={50}/></span>
                <span className={`${modelValue.notNext ? 'cursor-not-allowed opacity-[0.3]' : 'cursor-pointer'}`} onClick={nextWord}><SvgIcon name="next" color="#000" width={50}/></span>
            </div>
        </div>
    )
}
