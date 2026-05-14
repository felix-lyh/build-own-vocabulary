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
import { deleteOneVoca, updateVocabulary } from '@/request/vocabulary';
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
    const handleCheck = (checked: boolean, id: string) => {
        props.onSelectChange(checked, id)
    }
    const handleDeleteOneVoca = () => {
        deleteOneVoca(props.id).then(() => {
            props.onUpdateVacoList()
        })
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
        <div className="w-[30%] min-w-[300px] bg-white rounded-md border border-gray-200 p-[10px] cursor-pointer overflow-hidden">
            <div className='flex justify-between items-center mb-[6px]'>
                {props.isEditState && <Checkbox name={props.id} checked={props.isChecked} onCheckedChange={(event: boolean) => handleCheck(event, props.id)} />}
                <Popover>
                    <PopoverTrigger asChild>
                        <span className='inline-block ml-auto leading-[10px] w-[30px] h-[30px] text-center text-[36px] hover:bg-theme hover:text-[#fff] rounded-[6px]'>...</span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit py-[6px] px-0">
                        <ul>
                            {
                                props.SourceWeb && <li className='cursor-pointer px-[10px] hover:bg-theme hover:text-[#fff]' onClick={handleDataSource}>{$t('vocabulary_data_source')}</li>
                            }
                            {
                                isOneWord(props.vocabulary) && (
                                    <li className='cursor-pointer px-[10px] hover:bg-theme hover:text-[#fff]' onClick={handoutSidePronounce}>{$t('vocabulary_pronounce_outside')}</li>
                                )
                            }
                            <li className='cursor-pointer px-[10px] text-red-500 hover:bg-red-500 hover:text-[#fff]' onClick={handleDeleteOneVoca}>{$t('delete_btn')}</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='flex items-center justify-between'>
                <span>{modelValue.vocabulary}</span>
                <PlayVoice needInitVoice={false} voiceValue={modelValue.vocabulary} />
            </div>
            <div className='group min-h-[36px] flex items-center justify-between text-[13px] my-[5px]'>
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
                        <span onDoubleClick={() => setEditTrans(!isEditTrans)}>{modelValue.translations || $t('input_translations')}</span>
                }
                <span onClick={() => setEditTrans(!isEditTrans)} className='hidden group-hover:block ml-[10px]'>
                    <SvgIcon name='edit' width={30} height={30} />
                </span>
            </div>
            <div className='group min-h-[36px] flex items-center justify-between text-[13px] my-[5px]'>
                {isEditExample ?
                    <Input
                        defaultValue={modelValue.examples}
                        placeholder={$t('input_examples')}
                        className='text-[13px] py-[5px] px-[6px]'
                        onBlur={(e) => handleUpdate({ examples: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleUpdate({ examples: (e.target as HTMLInputElement).value });
                            }
                        }}
                    /> :
                    <span onDoubleClick={() => setEditExample(!isEditExample)}>{modelValue.examples || $t('input_examples')}</span>
                }
                <span onClick={() => setEditExample(!isEditExample)} className='hidden group-hover:block ml-[10px]'>
                    <SvgIcon name='edit' width={30} height={30} />
                </span>
            </div>
        </div>
    )
}
