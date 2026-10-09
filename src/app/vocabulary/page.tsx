"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import SvgIcon from '@/icons/svg-icon';
import type { BookType } from '@/type/vocabulary'
import { getBooks, deleteBook, deleteBookList } from '@/request/vocabulary'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import AddBookDialog from './components/add-book-dialog';
import AlertDialogTemplate from '@/components/alert-dialog-template';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// cycling gradient covers so each book looks like a distinct physical book
const BOOK_COVERS = [
    'from-[#1ABC9C] to-[#0E8C74]',
    'from-[#3498DB] to-[#21618C]',
    'from-[#9B59B6] to-[#6C3483]',
    'from-[#F39C12] to-[#B9770E]',
    'from-[#E74C3C] to-[#922B21]',
    'from-[#6366F1] to-[#4338CA]',
]
export default function Page() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [bookVisible, setBookVisible] = useState(false)
    const [bookList, setBookList] = useState<BookType[]>([])
    const [selectedBookIds, setSelectedBookIds] = useState<string[]>([])
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
    const [isEditState, setIsEditState] = useState(false)
    const addBookCallBack = (data: BookType) => {
        if (!data.bookId) return
        setBookList([data,...bookList ])
    }
    const getBookList = () => {
        getBooks({ limit: 0, page }).then((res: any) => {
            let list = res?.payload || []
            setBookList(list)
        }).catch(err => {

        })
    }
    const handleSelectBook = (bookId: string, checked: boolean) => {
        setSelectedBookIds(pre => checked ? [...pre, bookId] : pre.filter(id => id !== bookId))
    }
    const allBooksSelected = bookList.length > 0 && selectedBookIds.length === bookList.length
    const handleSelectAllBooks = (checked: boolean) => {
        setSelectedBookIds(checked ? bookList.map(book => book.bookId) : [])
    }
    const toggleEditState = () => {
        setIsEditState(pre => {
            if (pre) setSelectedBookIds([])
            return !pre
        })
    }
    const handleDeleteBook = (bookId: string) => {
        if (!bookId) return
        setPendingDeleteIds([bookId])
    }
    const handleDeleteSelected = () => {
        if (!selectedBookIds.length) return
        setPendingDeleteIds(selectedBookIds)
    }
    const confirmDeleteBook = () => {
        const ids = pendingDeleteIds
        if (!ids.length) return
        const req = ids.length === 1 ? deleteBook({ bookId: ids[0] }) : deleteBookList({ bookIdList: ids })
        req.then(() => {
            setBookList(bookList.filter(book => !ids.includes(book.bookId)))
            setSelectedBookIds(pre => pre.filter(id => !ids.includes(id)))
        }).catch(() => {

        }).finally(() => {
            setPendingDeleteIds([])
        })
    }
    useEffect(() => {
        getBookList()
    }, [])
    return (
        <>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] shadow-lg shadow-[#1ABC9C]/30 flex items-center justify-center'>
                        <SvgIcon width={24} height={24} name='vocabulary' color='#fff'></SvgIcon>
                    </div>
                    <div className='min-w-0'>
                        <h3 className='font-headline-lg font-bold text-xl text-on-surface'>{$t('vocabulary')}</h3>
                        <p className='text-sm text-zinc-500 mt-0.5 max-w-xl'>{$t('vocabulary.page.header_desc')}</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 shrink-0'>
                    <Link href="/practice" className='flex items-center cursor-pointer bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-xl h-fit py-[8px] px-4 text-sm font-medium shadow-sm hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all'>
                        <SvgIcon width={18} height={18} name='completion' color='#0E8C74'></SvgIcon>
                        <span className='ml-2'>{$t('practice')}</span>
                    </Link>
                    {bookList.length > 0 &&
                        <div onClick={toggleEditState} className='flex items-center cursor-pointer bg-white border border-[#1ABC9C]/50 text-[#0E8C74] rounded-xl h-fit py-[8px] px-4 text-sm font-medium shadow-sm hover:bg-[#E6F6F4] hover:border-[#1ABC9C] active:scale-95 transition-all'>
                            <SvgIcon width={18} height={18} name='edit' color='#0E8C74'></SvgIcon>
                            <span className='ml-2'>{isEditState ? $t('complete_btn') : $t('edit_btn')}</span>
                        </div>
                    }
                    <div onClick={() => setBookVisible(true)} className='flex items-center cursor-pointer bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] rounded-xl text-[#fff] h-fit py-[9px] px-4 text-sm font-medium shadow-md shadow-[#1ABC9C]/30 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all'>
                        <SvgIcon width={18} height={18} name='vocabulary' color='#fff'></SvgIcon>
                        <span className='ml-2'>{$t('add_vocabulary_book')}</span>
                    </div>
                </div>
            </div>
            {isEditState && bookList.length > 0 &&
                <div className='mt-4 flex items-center justify-between'>
                    <label className='flex items-center gap-2 cursor-pointer select-none' onClick={(e) => e.preventDefault()}>
                        <Checkbox checked={allBooksSelected} onCheckedChange={(checked) => handleSelectAllBooks(checked === true)} />
                        <span className='text-sm text-zinc-600'>{$t('select_all')}</span>
                    </label>
                    <Button disabled={!selectedBookIds.length} onClick={handleDeleteSelected} className='bg-red-500 hover:bg-red-600 text-white'>
                        {$t('delete_btn')}{selectedBookIds.length ? ` (${selectedBookIds.length})` : ''}
                    </Button>
                </div>
            }
            <div className='mt-6 h-full'>
                {
                    bookList.length ?
                        <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
                            {bookList.map((book, index) =>
                                <li key={book.bookId} onClick={() => router.push(`/vocabulary/${book.bookId}`)}>
                                    <div className={`group relative w-full aspect-[13/16] rounded-2xl bg-gradient-to-br ${BOOK_COVERS[index % BOOK_COVERS.length]} text-white shadow-lg shadow-black/10 overflow-hidden cursor-pointer p-4 sm:p-5 pl-6 sm:pl-7 flex flex-col hover:-translate-y-2 hover:rotate-[-1deg] hover:shadow-2xl hover:shadow-black/20 transition-all duration-300`}>
                                        {/* book spine */}
                                        <div className='absolute left-0 top-0 h-full w-[10px] bg-black/20 border-r border-white/25'></div>
                                        {/* monogram watermark */}
                                        <span className='absolute -right-3 -top-7 text-[120px] leading-none font-black text-white/10 select-none pointer-events-none'>
                                            {book.bookName?.charAt(0)?.toUpperCase()}
                                        </span>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex items-center gap-2'>
                                                {isEditState &&
                                                    <span onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox className='border-white/70'
                                                            checked={selectedBookIds.includes(book.bookId)}
                                                            onCheckedChange={(checked) => handleSelectBook(book.bookId, checked === true)} />
                                                    </span>
                                                }
                                                <span className='self-start text-[10px] tracking-[0.18em] uppercase font-bold bg-white/20 rounded-full px-2.5 py-1 backdrop-blur-sm'>
                                                    {$t('vocabulary')}
                                                </span>
                                            </div>
                                            <div className='opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e) => e.stopPropagation()}>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <span className='flex justify-center items-center cursor-pointer p-[4px] text-white/80 hover:bg-white/25 hover:text-white rounded-[6px] transition-colors'>
                                                            <SvgIcon name="more" />
                                                        </span>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-fit py-[6px] px-0">
                                                        <ul>
                                                            <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]'
                                                                onClick={() => handleDeleteBook(book.bookId)}>{$t('delete_btn')}</li>
                                                        </ul>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className='mt-auto relative'>
                                            <h4 className='font-headline-lg text-base sm:text-lg font-bold leading-snug line-clamp-2 drop-shadow-sm'>{book.bookName}</h4>
                                            {book.bookDesc && <p className='mt-1.5 text-xs text-white/75 leading-relaxed line-clamp-2 hidden sm:block'>{book.bookDesc}</p>}
                                            <div className='mt-3 flex items-center gap-1.5 text-xs font-semibold text-white/90 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300'>
                                                <span>{$t('start_learning')}</span>
                                                <SvgIcon width={14} height={14} name='next' color='#fff'></SvgIcon>
                                            </div>
                                        </div>
                                    </div>
                                </li>)}
                        </ul>
                        :
                        <div onClick={() => setBookVisible(true)} className="group mt-[65px] bg-white/50 border-2 border-dashed border-[#E9ECEF] rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-[#E6F6F4]/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-[#E6F6F4] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <SvgIcon width={32} height={326} name='addFile' color='#2EB7A3'></SvgIcon>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('add_vocabulary_book')}</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md">{$t('add_vocabulary_book_desc')}</p>
                        </div>
                }
            </div>
            <AddBookDialog
            dialogVisible={bookVisible}
            callbackData={addBookCallBack}
            handleDialogVisible={(value: boolean) => setBookVisible(value)}>
            </AddBookDialog>
            <AlertDialogTemplate
                visible={!!pendingDeleteIds.length}
                alertTitle={pendingDeleteIds.length === 1 ? $t('book.delete_alert_title') : $t('common.default_alert_title')}
                alertDescription={pendingDeleteIds.length === 1 ? $t('book.delete_alert_desc') : $t('common.default_alert_description')}
                comfirmCallback={confirmDeleteBook}
                cancelCallback={() => setPendingDeleteIds([])}>
            </AlertDialogTemplate>
        </>
    )
}
