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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { $t, isOneWord } from '@/utils/index'
import { speakWithVoice } from '@/utils/tts';
import { deleteVocaList, updateVocabulary } from '@/request/vocabulary';
import { cn } from '@/lib/utils';

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
    const [detailOpen, setDetailOpen] = useState(false)
    const [draftDefs, setDraftDefs] = useState<string[]>([])
    const [exitWin, setExitWin] = useState<Window | null>(null)

    const definitions = modelValue.definitions ?? []
    const firstDefinition = definitions[0] || ''
    const extraCount = Math.max(0, definitions.length - 1)

    const handleCheck = ({ selectType = "multi", checked, id }: { selectType?: "single" | "multi", checked: boolean, id: string }) => {
        props.onSelectChange({ selectType, checked, id })
    }
    const handleDeleteOneVoca = () => {
        props.onSelectChange({ selectType: "single", id: props.id })
    }
    const handleUpdate = (query: QueryVocabulary) => {
        updateVocabulary({ ...query, id: props.id }).then(() => {
            setEditTrans(false)
            setEditExample(false)
            setModelValue(Object.assign({}, modelValue, query))
        }).catch(() => { })
    }
    const handleDetailOpen = (open: boolean) => {
        setDetailOpen(open)
        if (open) {
            // seed the editable draft with the latest definitions
            setDraftDefs(definitions.length ? [...definitions] : [''])
        }
    }
    // save the whole definitions list; empty entries are dropped
    const saveDefinitions = (list: string[]) => {
        const cleaned = list.map(d => d.trim()).filter(Boolean)
        setDraftDefs(cleaned.length ? cleaned : [''])
        handleUpdate({ definitions: cleaned })
    }
    const handleDraftDefChange = (idx: number, value: string) => {
        setDraftDefs(prev => prev.map((d, i) => i === idx ? value : d))
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
        <>
            <div className="w-full sm:w-[47%] lg:w-[30%] min-w-0 bg-surface rounded-2xl border border-app-border shadow-[0_2px_10px_rgba(29,43,41,0.04)] p-4 sm:p-5 overflow-hidden hover:shadow-[0_12px_28px_rgba(26,188,156,0.14)] hover:border-[#1ABC9C]/30 hover:-translate-y-0.5 transition-all duration-300">
                {/* header: checkbox + source tag + menu */}
                <div className='flex justify-between items-center mb-2'>
                    {props.isEditState && <Checkbox name={props.id} checked={props.isChecked} onCheckedChange={(event: boolean) => handleCheck({ checked: event, id: props.id })} />}
                    {props.SourceWeb && (
                        <span onClick={handleDataSource} className='text-[11px] text-[#1ABC9C] bg-accent-soft rounded-full px-2 py-0.5 truncate max-w-[50%] cursor-pointer hover:bg-[#1ABC9C] hover:text-white transition-colors'>{$t('vocabulary_data_source')}</span>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <span className='inline-block ml-auto leading-[10px] w-[30px] h-[30px] text-center text-[30px] text-app-fg-muted hover:bg-theme hover:text-[#fff] rounded-[6px] transition-colors'>...</span>
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
                    <span className='text-2xl font-headline-lg font-bold text-app-fg break-all leading-tight'>{modelValue.vocabulary}</span>
                    <div className='shrink-0 w-10 h-10 rounded-full bg-accent-soft text-[#1ABC9C] flex items-center justify-center hover:bg-theme hover:text-white transition-colors'>
                        <PlayVoice needInitVoice={false} voiceValue={modelValue.vocabulary} />
                    </div>
                </div>

                {/* definitions — show first inline, badge for more, plus "More" button */}
                {(firstDefinition || definitions.length > 0) && (
                    <div className='my-2.5'>
                        <div className='flex items-start gap-2 text-[13px] text-app-fg leading-relaxed'>
                            <span className='shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1ABC9C]/15 text-[#1ABC9C] text-[11px] font-semibold mt-0.5'>1</span>
                            <span className='flex-1'>{firstDefinition}</span>
                        </div>
                        {extraCount > 0 && (
                            <div className='mt-1.5 flex items-center gap-2 pl-7'>
                                <span className='inline-flex items-center gap-1 text-[11px] text-[#1ABC9C] bg-[#1ABC9C]/10 rounded-full px-2 py-0.5'>
                                    +{extraCount} {$t('definitions_more')}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* example */}
                <div className='group min-h-[38px] flex items-center justify-between gap-2 border-l-[3px] border-[#1ABC9C]/40 pl-3 text-[13px] text-app-fg-muted italic my-1'>
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
                        <span onClick={() => modelValue.examples && speakWithVoice(modelValue.examples)} className='leading-relaxed cursor-pointer'>{modelValue.examples || $t('input_examples')}</span>
                    }
                    <span onClick={() => setEditExample(!isEditExample)} className='hidden group-hover:block shrink-0 text-[#1ABC9C]'>
                        <SvgIcon name='edit' width={22} height={22} />
                    </span>
                </div>

                {/* translation */}
                <div className='group min-h-[44px] flex items-center justify-between gap-2 rounded-lg bg-accent-soft/60 px-3 py-2 text-[13px] text-accent-strong my-2.5'>
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

                {/* footer: More button */}
                <div className='mt-3 pt-2.5 border-t border-app-border/50 flex justify-end'>
                    <button
                        onClick={() => setDetailOpen(true)}
                        className={cn(
                            "inline-flex items-center gap-1 text-[12px] font-medium rounded-full px-3 py-1.5 transition-colors",
                            "text-[#1ABC9C] bg-[#1ABC9C]/10 hover:bg-[#1ABC9C] hover:text-white"
                        )}
                    >
                        {$t('vocabulary_detail')}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
            </div>

            {/* Detail dialog */}
            <Dialog open={detailOpen} onOpenChange={handleDetailOpen}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                    <DialogTitle className="sr-only"></DialogTitle>
                    <DialogDescription className="sr-only"></DialogDescription>

                    {/* Word header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-app-border">
                        <div className='w-12 h-12 rounded-full bg-accent-soft text-[#1ABC9C] flex items-center justify-center shrink-0'>
                            <PlayVoice needInitVoice={false} voiceValue={modelValue.vocabulary} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-headline-lg font-bold text-app-fg break-all leading-tight">
                                {modelValue.vocabulary}
                            </h2>
                        </div>
                        {props.SourceWeb && (
                            <button
                                onClick={handleDataSource}
                                className="text-[11px] text-[#1ABC9C] bg-accent-soft rounded-full px-3 py-1 hover:bg-[#1ABC9C] hover:text-white transition-colors shrink-0"
                            >
                                {$t('vocabulary_data_source')}
                            </button>
                        )}
                    </div>

                    {/* Definitions — editable, same input behavior as card */}
                    <section className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-[11px] uppercase tracking-wider text-app-fg-muted">
                                {$t('collect_words.definitions')}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setDraftDefs(prev => [...prev, ''])}
                                className='text-[12px] text-[#1ABC9C] hover:text-[#0E8C74] font-medium inline-flex items-center gap-1'
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                {$t('add_definition')}
                            </button>
                        </div>
                        <div className='space-y-2'>
                            {draftDefs.map((def, idx) => (
                                <div key={idx} className='flex items-center gap-2'>
                                    <span className='shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1ABC9C]/15 text-[#1ABC9C] text-[11px] font-semibold'>
                                        {idx + 1}
                                    </span>
                                    <Input
                                        value={def}
                                        onChange={(e) => handleDraftDefChange(idx, e.target.value)}
                                        onBlur={() => saveDefinitions(draftDefs)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveDefinitions(draftDefs);
                                            }
                                        }}
                                        className='flex-1 text-[13px]'
                                        placeholder={`${$t('collect_words.definitions')} ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => saveDefinitions(draftDefs.filter((_, i) => i !== idx))}
                                        className='shrink-0 text-app-fg-muted hover:text-red-500 transition-colors p-1'
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Example — editable, same input behavior as card */}
                    <section className="mt-4">
                        <h3 className="text-[11px] uppercase tracking-wider text-app-fg-muted mb-1.5">{$t('collect_words.examples')}</h3>
                        <Input
                            defaultValue={modelValue.examples}
                            placeholder={$t('input_examples')}
                            className='text-[13px] italic'
                            onBlur={(e) => handleUpdate({ examples: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleUpdate({ examples: (e.target as HTMLInputElement).value });
                                }
                            }}
                        />
                    </section>

                    {/* Translation — editable, same input behavior as card */}
                    <section className="mt-4">
                        <h3 className="text-[11px] uppercase tracking-wider text-app-fg-muted mb-1.5">{$t('collect_words.translation')}</h3>
                        <Input
                            defaultValue={modelValue.translations}
                            placeholder={$t('input_translations')}
                            className='text-[13px]'
                            onBlur={(e) => handleUpdate({ translations: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleUpdate({ translations: (e.target as HTMLInputElement).value });
                                }
                            }}
                        />
                    </section>

                    {/* Footer */}
                    <div className="mt-5 flex justify-end gap-2">
                        <DialogClose asChild>
                            <button className="text-[12px] px-4 py-2 rounded-md border border-app-border text-app-fg-muted hover:text-app-fg transition-colors">
                                {$t('common.close')}
                            </button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
