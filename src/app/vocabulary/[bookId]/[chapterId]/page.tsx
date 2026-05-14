"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import { useParams } from 'next/navigation';
import BackBtn from '@/components/back-btn';
import AddVocaDialog from '../../components/add-voca-dialog'
import HeaderBar from '@/components/header-bar';
import { getVocabularyList } from '@/request/vocabulary'
import type { VocabularyDataType } from '@/type/vocabulary'
import VocaCard from '../../components/voca-card';
export default function Page() {
    const params = useParams()
    const bookId = params.bookId as string
    const chapterId = params.chapterId as string
    const [addVocaVisible,setAddVocaVisible] = useState(false)
    const [vocaList,setVocalist] = useState<VocabularyDataType[]>([])

    const updateVocaList = (data:VocabularyDataType)=>{
        setVocalist([...vocaList,data])
    }
    const getVocaList = () => {
        getVocabularyList({ bookId, chapterId, limit: 0, page: 1 }).then((res: any) => {
            setVocalist(res?.payload || [])
        }).catch((err) => {

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
                    <span onClick={() => setAddVocaVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('add_vocabulary')}</span>  
                }
            >
            </HeaderBar>
            <div className='flex flex-wrap my-[20px] justify-center gap-4'>
                {vocaList.map(voca=>{
                    return <VocaCard 
                    isEditState={false} 
                    isChecked={false} 
                    onSelectChange={()=>{}} 
                    onUpdateVacoList={()=>{}} 
                    key={voca.id} 
                    {...voca}>
                    </VocaCard>
                })}
            </div>
            <AddVocaDialog 
            dialogVisible={addVocaVisible} 
            bookId={bookId} 
            chapterId={chapterId} 
            callbackData={updateVocaList}
            handleDialogVisible={setAddVocaVisible}
            >
            </AddVocaDialog>
        </div>
    )
}
