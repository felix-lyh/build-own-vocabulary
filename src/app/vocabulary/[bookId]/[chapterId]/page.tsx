"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BackBtn from '@/components/back-btn';
import SvgIcon from '@/icons/svg-icon';
import AddVocaDialog from '../../components/add-voca-dialog'
import HeaderBar from '@/components/header-bar';
import { getVocabularyList,deleteVocaList } from '@/request/vocabulary'
import type { VocabularyDataType } from '@/type/vocabulary'
import VocaCard from '../../components/voca-card';
import { Checkbox } from '@/components/ui/checkbox';
import AlertDialogTemplate from '@/components/alert-dialog-template';
export default function Page() {
    const params = useParams()
    const bookId = params.bookId as string
    const chapterId = params.chapterId as string
    const [addVocaVisible,setAddVocaVisible] = useState(false)
    const [vocaList,setVocalist] = useState<VocabularyDataType[]>([])

    const updateVocaList = (data:VocabularyDataType)=>{
        setVocalist([data,...vocaList,])
    }
    const getVocaList = () => {
        getVocabularyList({ bookId, chapterId, limit: 0, page: 1 }).then((res: any) => {
            setVocalist(res?.payload || [])
        }).catch((err) => {

        })
    }

    const [alertVisible, setAlertVisible] = useState(false)
    const [selectVocaIds, setSelectVocaIds] = useState<string[]>([])
    const [isEditState, setIsEditState] = useState(false)
    const handleSelectChange = ({selectType="multi",checked, id}: {selectType?:"single"|"multi",checked: boolean, id: string}) => {
        if(selectType === "single") {
            setSelectVocaIds([id])
            setAlertVisible(true)
        } else {
            if(checked) {
                setSelectVocaIds([...selectVocaIds, id])
            } else {
                setSelectVocaIds(selectVocaIds.filter(item=>item!==id))
            }
        }
    }
    const allVocaSelected = vocaList.length > 0 && selectVocaIds.length === vocaList.length
    const handleSelectAllVoca = (checked: boolean) => {
        setSelectVocaIds(checked ? vocaList.map(voca => voca.id) : [])
    }
    const toggleEditState = () => {
        setIsEditState(pre => {
            if (pre) setSelectVocaIds([])
            return !pre
        })
    }
    const handleDeleteSelected = () => {
        if (!selectVocaIds.length) return
        setAlertVisible(true)
    }
    const handleDeleteVoca = () => {
        deleteVocaList(selectVocaIds).then(()=>{
            setAlertVisible(false)
            setVocalist(vocaList.filter(item=>!selectVocaIds.includes(item.id)))
            setSelectVocaIds([])
        }).catch(()=>{

        })
    }
    useEffect(()=>{
        getVocaList()
    },[bookId, chapterId])
    return (
        <div>
            <HeaderBar
                leftContent={<BackBtn path={`/vocabulary/${bookId}`}></BackBtn>}
                rightContent={
                    <div className='flex items-center gap-3'>
                        <Link href={`/practice?bookId=${bookId}&chapterId=${chapterId}`} className='bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-lg text-sm py-[8px] px-3 cursor-pointer hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all flex items-center gap-1.5'>
                            <SvgIcon width={16} height={16} name='completion' color='#0E8C74' />
                            {$t('practice')}
                        </Link>
                        {vocaList.length > 0 &&
                            <span onClick={toggleEditState} className='flex items-center cursor-pointer bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-lg text-sm py-[8px] px-3 shadow-sm hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all'>
                                <SvgIcon width={16} height={16} name='edit' color='#0E8C74' />
                                <span className='ml-1.5'>{isEditState ? $t('complete_btn') : $t('edit_btn')}</span>
                            </span>
                        }
                        <span onClick={() => setAddVocaVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('add_vocabulary')}</span>
                    </div>
                }
            >
            </HeaderBar>
            {isEditState && vocaList.length > 0 &&
                <div className='flex items-center justify-between mt-5 px-1 sm:px-0 sm:ml-[25px] sm:mr-8'>
                    <label className='flex items-center gap-2 cursor-pointer select-none' onClick={(e) => e.preventDefault()}>
                        <Checkbox checked={allVocaSelected} onCheckedChange={(checked) => handleSelectAllVoca(checked === true)} />
                        <span className='text-sm text-zinc-600'>{$t('select_all')}</span>
                    </label>
                    <button disabled={!selectVocaIds.length} onClick={handleDeleteSelected} className='bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-xl py-[7px] px-4 text-sm font-medium shadow-sm active:scale-95 transition-all'>
                        {$t('delete_btn')}{selectVocaIds.length ? ` (${selectVocaIds.length})` : ''}
                    </button>
                </div>
            }
            <div className='flex flex-wrap my-[20px] px-1 sm:px-0 sm:ml-[25px] gap-3 sm:gap-4'>
                {vocaList.map(voca=>{
                    return <VocaCard
                    isEditState={isEditState}
                    isChecked={selectVocaIds.includes(voca.id)}
                    onSelectChange={handleSelectChange}
                    onUpdateVacoList={()=>{}}
                    key={voca.id}
                    {...voca}>
                    </VocaCard>
                })}
            </div>

            <AlertDialogTemplate
            visible={alertVisible}
            alertTitle={selectVocaIds.length === 1 ? $t('vocabulary.delete_alert_title') : $t('common.default_alert_title')}
            alertDescription={selectVocaIds.length === 1 ? $t('vocabulary.delete_alert_desc') : $t('common.default_alert_description')}
            comfirmCallback={handleDeleteVoca}
            cancelCallback={()=>{
                setAlertVisible(false)
                if(selectVocaIds.length>1) setSelectVocaIds([])
            }} />


            <AddVocaDialog 
            dialogVisible={addVocaVisible} 
            bookId={bookId} 
            chapterId={chapterId} 
            callbackData={updateVocaList}
            handleDialogVisible={setAddVocaVisible}
            />
        </div>
    )
}
