"use client";
import { useState } from 'react'
import type { VocabularyDataType } from '@/type/vocabulary'
import PlayVoice from "@/components/play-voice";
import SvgIcon from "@/icons/svg-icon";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { $t,isOneWord } from '@/utils/index'
import { speakWithVoice } from '@/utils/tts';
import { deleteVocaList, updateVocabulary } from '@/request/vocabulary';
interface PropType extends VocabularyDataType {
    isEditState: boolean;
    isChecked: boolean;
    onSelectChange: Function;
    onUpdateVacoList: Function
}
type QueryVocabulary = Partial<VocabularyDataType>;
export default function VocabularyCard(props: PropType) {
    const [modelValue, setModelValue] = useState<PropType>(props)
    const [isEditTrans, setEditTrans] = useState(false)
    const [isEditExample, setEditExample] = useState(false)
    const [exitWin, setExitWin] = useState<Window | null>(null)
    const handleCheck = ({selectType="multi",checked, id}: {selectType?:"single"|"multi",checked: boolean, id: string}) => {
        props.onSelectChange({selectType,checked, id})
    }
    const handleDeleteOneVoca = () => {
        props.onSelectChange({selectType:"single",id: props.id})
        // deleteOneVoca(props.id).then(() => {
        //     props.onUpdateVacoList()
        // })
    }
    const handleUpdate = (query: QueryVocabulary) => {
        updateVocabulary({ ...query, id: props.id }).then(() => {
            setEditTrans(false)
            setEditExample(false)
            setModelValue(Object.assign({}, modelValue, query))
        }).catch(() => {

        })
    }
    const handleDataSource = () => {
        window.open(props.SourceWeb, '_blank')
    }
    const handoutSidePronounce = () => {
        if (!exitWin || exitWin.closed) {
            setExitWin(window.open(
                `https://youglish.com/pronounce/${props.vocabulary}/english/all`,
                'youglishWindow'
            ));
        } else {
            exitWin.location.href = `https://youglish.com/pronounce/${props.vocabulary}/english/all`;
            exitWin.focus();
        }
    }
    return (
        <div className="w-full sm:w-[47%] lg:w-[30%] min-w-0 bg-white rounded-2xl border border-zinc-100 shadow-[0_2px_10px_rgba(29,43,41,0.04)] p-4 sm:p-5 cursor-pointer overflow-hidden hover:shadow-[0_12px_28px_rgba(26,188,156,0.14)] hover:border-[#1ABC9C]/30 hover:-translate-y-0.5 transition-all duration-300">
            <div className='flex justify-between items-center mb-2'>
                {props.isEditState && <Checkbox name={props.id} checked={props.isChecked} onCheckedChange={(event: boolean) => handleCheck({checked: event, id: props.id})} />}
                {props.SourceWeb && (
                    <span onClick={handleDataSource} className='text-[11px] text-[#1ABC9C] bg-[#E6F6F4] rounded-full px-2 py-0.5 truncate max-w-[50%] cursor-pointer hover:bg-[#1ABC9C] hover:text-white transition-colors'>{$t('vocabulary_data_source')}</span>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <span className='inline-block ml-auto leading-[10px] w-[30px] h-[30px] text-center text-[30px] text-zinc-400 hover:bg-theme hover:text-[#fff] rounded-[6px] transition-colors'>...</span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit py-[6px] px-0">
                        <ul>
                            {
                                props.SourceWeb && <li className='cursor-pointer px-[10px] py-1 hover:bg-theme hover:text-[#fff]' onClick={handleDataSource}>{$t('vocabulary_data_source')}</li>
                            }
                            {
                                isOneWord(props.vocabulary) && (
                                    <li className='cursor-pointer px-[10px] py-1 hover:bg-theme hover:text-[#fff]' onClick={handoutSidePronounce}>{$t('vocabulary_pronounce_outside')}</li>
                                )
                            }
                            <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]' onClick={handleDeleteOneVoca}>{$t('delete_btn')}</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>
            {/* word + pronunciation */}
            <div className='flex items-center justify-between gap-2'>
                <span className='text-2xl font-headline-lg font-bold text-zinc-800 break-all leading-tight'>{modelValue.vocabulary}</span>
                <div className='shrink-0 w-10 h-10 rounded-full bg-[#E6F6F4] text-[#1ABC9C] flex items-center justify-center hover:bg-theme hover:text-white transition-colors'>
                    <PlayVoice needInitVoice={false} voiceValue={modelValue.vocabulary} />
                </div>
            </div>
            {/* translation */}
            <div className='group min-h-[44px] flex items-center justify-between gap-2 rounded-lg bg-[#E6F6F4]/60 px-3 py-2 text-[13px] text-[#0E8C74] my-2.5'>
                {
                    isEditTrans ?
                        <Input
                            defaultValue={modelValue.translations}
                            className='text-[13px] py-[5px] px-[6px]'
                            placeholder={$t('input_translations')}
                            onBlur={(e) => handleUpdate({ translations: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleUpdate({ translations: (e.target as HTMLInputElement).value });
                                }
                            }}
                        /> :
                        <span onDoubleClick={() => setEditTrans(!isEditTrans)} className='leading-relaxed'>{modelValue.translations || $t('input_translations')}</span>
                }
                <span onClick={() => setEditTrans(!isEditTrans)} className='hidden group-hover:block shrink-0 text-[#1ABC9C]'>
                    <SvgIcon name='edit' width={22} height={22} />
                </span>
            </div>
            {/* example */}
            <div className='group min-h-[38px] flex items-center justify-between gap-2 border-l-[3px] border-[#1ABC9C]/40 pl-3 text-[13px] text-zinc-500 italic my-1'>
                {isEditExample ?
                    <Input
                        defaultValue={modelValue.examples}
                        placeholder={$t('input_examples')}
                        className='text-[13px] py-[5px] px-[6px] italic'
                        onBlur={(e) => handleUpdate({ examples: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleUpdate({ examples: (e.target as HTMLInputElement).value });
                            }
                        }}
                    /> :
                    <span onClick={() => modelValue.examples && speakWithVoice(modelValue.examples)} className='leading-relaxed'>{modelValue.examples || $t('input_examples')}</span>
                }
                <span onClick={() => setEditExample(!isEditExample)} className='hidden group-hover:block shrink-0 text-[#1ABC9C]'>
                    <SvgIcon name='edit' width={22} height={22} />
                </span>
            </div>
        </div>
    )
}
