"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BackBtn from '@/components/back-btn';
import SvgIcon from '@/icons/svg-icon';
import AddVocaDialog from '../components/add-voca-dialog'
import ChapterCard from '../components/chapter-card';
import AddChapterDialog from '../components/add-chapter-dialog'
import HeaderBar from '@/components/header-bar';
import { getChapters,delChapter,deleteChapterList } from '@/request/vocabulary';
import { Checkbox } from '@/components/ui/checkbox';
import AlertDialogTemplate from '@/components/alert-dialog-template';
import type { BookChapterType } from '@/type/chapter'
import { useRouter } from 'next/navigation'
export default function Page() {
    const params = useParams()
    const bookId = params.bookId as string
    const router = useRouter()
    const [chapterDialogVisible, setChapterDialogVisible] = useState(false)
    const [chapterList, setChapterList] = useState<BookChapterType[]>([])
    const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([])
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
    const [isEditState, setIsEditState] = useState(false)
    const chapterDialogCallback = (data: BookChapterType) => {
        setChapterList((pre: BookChapterType[]) => {
            return [data, ...pre]
        })
    }
    const getChapterList = ()=>{
        getChapters({ bookId, limit: 0, page: 1 }).then((res: any) => {
            setChapterList(res?.payload || [])
        }).catch((err) => {

        })
    }
    const handleDelChapter = (chapterId:string)=>{
        if (!chapterId) return
        setPendingDeleteIds([chapterId])
    }
    const handleSelectChapter = (chapterId: string, checked: boolean) => {
        setSelectedChapterIds(pre => checked ? [...pre, chapterId] : pre.filter(id => id !== chapterId))
    }
    const allChaptersSelected = chapterList.length > 0 && selectedChapterIds.length === chapterList.length
    const handleSelectAllChapters = (checked: boolean) => {
        setSelectedChapterIds(checked ? chapterList.map(chapter => chapter.chapterId) : [])
    }
    const toggleEditState = () => {
        setIsEditState(pre => {
            if (pre) setSelectedChapterIds([])
            return !pre
        })
    }
    const handleDeleteSelected = () => {
        if (!selectedChapterIds.length) return
        setPendingDeleteIds(selectedChapterIds)
    }
    const confirmDeleteChapter = () => {
        const ids = pendingDeleteIds
        if (!ids.length) return
        const req = ids.length === 1 ? delChapter({ chapterId: ids[0] }) : deleteChapterList({ chapterIdList: ids })
        req.then(() => {
            setChapterList(chapterList.filter(chapter => !ids.includes(chapter.chapterId)))
            setSelectedChapterIds(pre => pre.filter(id => !ids.includes(id)))
        }).catch(err=>{
            // TODO
        }).finally(() => {
            setPendingDeleteIds([])
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
                    <div className='flex items-center gap-3'>
                        <Link href={`/practice?bookId=${bookId}`} className='flex items-center cursor-pointer bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-lg h-fit py-[7px] px-3 text-sm font-medium shadow-sm hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all'>
                            <SvgIcon width={16} height={16} name='completion' color='#0E8C74'></SvgIcon>
                            <span className='ml-2'>{$t('practice')}</span>
                        </Link>
                        {chapterList.length > 0 &&
                            <span onClick={toggleEditState} className='flex items-center cursor-pointer bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-lg h-fit py-[7px] px-3 text-sm font-medium shadow-sm hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all'>
                                <SvgIcon width={16} height={16} name='edit' color='#0E8C74'></SvgIcon>
                                <span className='ml-2'>{isEditState ? $t('complete_btn') : $t('edit_btn')}</span>
                            </span>
                        }
                        <span onClick={() => setChapterDialogVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('add_vocabulary_book_chapter')}</span>
                    </div>
                }
            >
            </HeaderBar>
            <div className='pt-[30px] h-[calc(100vh-100px)] overflow-y-auto'>
                {isEditState && chapterList.length > 0 &&
                    <div className='w-[60%] mx-auto mb-4 flex items-center justify-between'>
                        <label className='flex items-center gap-2 cursor-pointer select-none' onClick={(e) => e.preventDefault()}>
                            <Checkbox checked={allChaptersSelected} onCheckedChange={(checked) => handleSelectAllChapters(checked === true)} />
                            <span className='text-sm text-zinc-600'>{$t('select_all')}</span>
                        </label>
                        <button disabled={!selectedChapterIds.length} onClick={handleDeleteSelected} className='bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-xl py-[7px] px-4 text-sm font-medium shadow-sm active:scale-95 transition-all'>
                            {$t('delete_btn')}{selectedChapterIds.length ? ` (${selectedChapterIds.length})` : ''}
                        </button>
                    </div>
                }
                <ul className="w-[60%] mx-auto flex flex-col items-center">
                    {
                        chapterList.map(chapter => {
                            return <li className='w-full mb-4' onClick={() =>router.push(`/vocabulary/${bookId}/${chapter.chapterId}`)} key={chapter.chapterId}>
                                <ChapterCard {...chapter} callback = {handleDelChapter}
                                    isEditState={isEditState}
                                    isChecked={selectedChapterIds.includes(chapter.chapterId)}
                                    onSelectChange={handleSelectChapter}/>
                            </li>
                        })
                    }
                </ul>
            </div>
            <AlertDialogTemplate
                visible={!!pendingDeleteIds.length}
                alertTitle={pendingDeleteIds.length === 1 ? $t('chapter.delete_alert_title') : $t('common.default_alert_title')}
                alertDescription={pendingDeleteIds.length === 1 ? $t('chapter.delete_alert_desc') : $t('common.default_alert_description')}
                comfirmCallback={confirmDeleteChapter}
                cancelCallback={() => setPendingDeleteIds([])}>
            </AlertDialogTemplate>
            <AddChapterDialog
                dialogVisible={chapterDialogVisible}
                bookId={bookId}
                callbackData={chapterDialogCallback}
                handleDialogVisible={setChapterDialogVisible}>
            </AddChapterDialog>
        </>
    )
}
