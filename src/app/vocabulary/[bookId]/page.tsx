"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import { useParams } from 'next/navigation';
import BackBtn from '@/components/back-btn';
import AddVocaDialog from '../components/add-voca-dialog';
import AlertDialogTemplate from "@/components/alert-dialog-template";
import ChapterCard from '../components/chapter-card';
import AddChapterDialog from '../components/add-chapter-dialog'
import HeaderBar from '@/components/header-bar';
import { getChapters,deleteChapter} from '@/request/chapter';
import type { BookChapterType } from '@/type/chapter'
import { useRouter } from 'next/navigation'
export default function Page() {
    const params = useParams()
    const bookId = params.bookId as string
    const router = useRouter()
    const [chapterDialogVisible, setChapterDialogVisible] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [chapterList, setChapterList] = useState<BookChapterType[]>([])
    const chapterDialogCallback = (data: BookChapterType) => {
        setChapterList((pre: BookChapterType[]) => {
            return [...pre,data]
        })
    }

    const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([])
    const chapterCallback = (chapterId: string) => {
        setSelectedChapterIds([chapterId])
        setAlertVisible(true)
    }   
    const chapterDeleteCallback = () => {
        deleteChapter({ chapterIdList: selectedChapterIds }).then(() => {
            if(selectedChapterIds && selectedChapterIds.length >1 ) {
                getChapterList()
            }else{
                setChapterList((pre: BookChapterType[]) => {
                    return pre.filter(item => item.chapterId !== selectedChapterIds[0])
                })
            }
            setSelectedChapterIds([])
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setAlertVisible(false)
        })
        
    }
    const getChapterList = () => {
        getChapters({ bookId, limit: 0, page: 1 }).then((res: any) => {
            setChapterList(res?.payload || [])
        }).catch((err) => {

        })
    }
    useEffect(() => {
        getChapterList()
    }, [bookId])

    
    return (
        <>
            <HeaderBar
                leftContent={<BackBtn path='/vocabulary'></BackBtn>}
                rightContent={
                    <span onClick={() => setChapterDialogVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('add_vocabulary_book_chapter')}</span>
                }
            >
            </HeaderBar>
            <div className='pt-[30px] h-[calc(100vh-100px)] overflow-y-auto'>
                <ul className="w-[60%] mx-auto flex flex-col items-center">
                    {
                        chapterList.map(chapter => {
                            return <li className='w-full mb-4' 
                                onClick={() =>router.push(`/vocabulary/${bookId}/${chapter.chapterId}`)} 
                                key={chapter.chapterId}>
                                <ChapterCard callback={chapterCallback} {...chapter} />
                            </li>
                        })
                    }
                </ul>
            </div>
            <AlertDialogTemplate
                visible={alertVisible}
                alertTitle={$t('chapter.delete_alert_title')}
                alertDescription={$t('chapter.delete_alert_desc')}
                comfirmCallback={chapterDeleteCallback}
                cancelCallback={() => setAlertVisible(false)} />

            <AddChapterDialog
                dialogVisible={chapterDialogVisible}
                bookId={bookId}
                callbackData={chapterDialogCallback}
                handleDialogVisible={setChapterDialogVisible}>
            </AddChapterDialog>
        </>
    )
}
