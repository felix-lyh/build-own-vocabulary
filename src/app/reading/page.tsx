'use client';
import SvgIcon from '@/icons/svg-icon';
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog";
export default function Page() {
    const [open, setOpen] = useState(false)
    const handleSubmit = (event: any) => {
        // if(!bookName) return
        event.preventDefault();
        // addBook({ bookName }).then(() => {
        //     setOpen(false)
        //     getBookList()
        // })
    }
    return (
        <div>
            <div className='flex justify-between'>
                <div>
                    <h1>{$t('wirte_practice.header')}</h1>
                    <p>{$t('wirte_practice.header_desc')}</p>
                </div>
                <Dialog open={open} onOpenChange={(value)=>setOpen(value)}>
                    <DialogTrigger>
                        <div onClick={() => setOpen(true)} className='flex items-center bg-primary rounded-md text-[#fff] py-[8px] px-[10px]'>
                            <SvgIcon width={16} height={16} name='addFile' color='#fff'></SvgIcon>
                            <span className='ml-[10px]'>{$t('add_article')}</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                        <form onSubmit={handleSubmit}>
                            {/* <div className='flex items-center mt-[20px]'>
                                <label>{$t('add_book.name')}</label>
                                <Input value={bookName} onChange={(e: any) =>
                                    setBookName(e.target.value)
                                } className='flex-1 ml-[15px]' placeholder={$t('add_book.name')}></Input>
                            </div>
                            <div className='flex justify-end mt-[20px]'>
                                <DialogClose asChild>
                                    <Button onClick={()=>setOpen(false)} type="button">{$t('common.close')}</Button>
                                </DialogClose>
                                <Button className='ml-[20px]' disabled={!bookName} type='submit'>{$t('common.save')}</Button>
                            </div> */}
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className=''>
                <ul className='flex '>
                </ul>
            </div>
            <div className="">
            </div>
        </div>
    );
}
