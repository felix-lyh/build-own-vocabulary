"use client";
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import SvgIcon from '@/icons/svg-icon';
import type { BookType } from '@/type/vocabularyBook'
import { getBooks } from '@/request/book'
import Link from 'next/link';
import AddBookDialog from './components/add-book-dialog';
export default function Page() {
    const [page, setPage] = useState(1)
    const [bookVisible, setBookVisible] = useState(false)
    const [bookList, setBookList] = useState<BookType[]>([])
    const addBookCallBack = (data: BookType) => {
        // if (!bookName) return
        // addBook({ bookName }).then(() => {
        //     setBookVisible(false)
        //     getBookList()
        // })
    }
    const getBookList = () => {
        getBooks({ limit: 0, page }).then((res: any) => {
            let list = res?.payload || []
            setBookList(list)
        }).catch(err => {

        })
    }
    useEffect(() => {
        getBookList()
    }, [])
    return (
        <>
            <div className='flex justify-between'>
                <h3>{$t('vocabulary.page.header_desc')}</h3>
                <div onClick={() => setBookVisible(true)} className='flex items-center cursor-pointer bg-primary rounded-lg text-[#fff] h-fit py-[8px] px-[10px]'>
                    <SvgIcon width={20} height={20} name='vocabulary' color='#fff'></SvgIcon>
                    <span className='ml-[10px]'>{$t('add_vocabulary_book')}</span>
                </div>
            </div>
            <div className='mt-[15px] h-full'>
                {
                    bookList.length ?
                        <ul className='flex flex-wrap'>
                            {bookList.map(book =>
                                <div key={book.bookId} className="flex mt-[15px] gap-8 cursor-pointer">
                                    <Link href={`/vocabulary/${book.bookId}`} className="block">
                                        <div className="group relative h-60 w-52 [perspective:1000px] text-[#fff] text-2xl" >
                                            <div className="absolute inset-0 h-full w-48 rounded-lg bg-primary shadow-md"></div>
                                            <div className="relative z-50 h-full w-48 origin-left transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-30deg)]">
                                                <div className="rounded-lg bg-white shadow-md absolute flex w-full h-full [backface-visibility:hidden]">
                                                    <div className="relative flex h-full w-full flex-col items-start justify-between rounded-lg p-4" >
                                                        <div className="absolute inset-0 w-full rounded-lg bg-[#a8a8a8] py-[10px] px-[15px]">{book.bookName}</div>
                                                        <div className="relative z-10 flex w-full flex-1 flex-col">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="z-1 absolute bottom-0 right-0 flex h-48 w-14 -translate-x-10 transform items-start justify-start rounded-r-lg bg-green-600 pl-2 pt-2 text-xs font-bold text-white transition-transform duration-300 ease-in-out [backface-visibility:hidden] group-hover:translate-x-0 group-hover:rotate-[5deg]"><div className="-rotate-90 whitespace-nowrap pb-16 pr-9">CLICK TO READ</div>
                                        </div> */}
                                        </div>
                                    </Link>
                                </div>)}
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
        </>
    )
}
