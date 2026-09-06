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
    const handleDeleteVoca = () => {
        deleteVocaList(selectVocaIds).then(()=>{
            setAlertVisible(false)
            if(selectVocaIds.length>1){
                getVocaList()
            }else{
                setVocalist(vocaList.filter(item=>item.id!==selectVocaIds[0]))
            }
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
                        <span onClick={() => setAddVocaVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('add_vocabulary')}</span>
                    </div>
                }
            >
            </HeaderBar>
            <div className='flex flex-wrap my-[20px] px-1 sm:px-0 sm:ml-[25px] gap-3 sm:gap-4'>
                {vocaList.map(voca=>{
                    return <VocaCard 
                    isEditState={false} 
                    isChecked={false} 
                    onSelectChange={handleSelectChange} 
                    onUpdateVacoList={()=>{}} 
                    key={voca.id} 
                    {...voca}>
                    </VocaCard>
                })}
            </div>

            <AlertDialogTemplate
            visible={alertVisible}
            alertTitle={$t('chapter.delete_alert_title')}
            alertDescription={$t('chapter.delete_alert_desc')}
            comfirmCallback={handleDeleteVoca}
            cancelCallback={()=>{
                setAlertVisible(false)
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
