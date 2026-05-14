
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import { $t } from '@/utils/index';
import type { AddBookType } from '@/type/vocabularyBook'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addBook } from '@/request/book'
interface PropType {
    dialogVisible: boolean,
    callbackData: Function,
    handleDialogVisible: Function
}
export default function AddBookDialog({ dialogVisible, callbackData, handleDialogVisible }: PropType) {
    const [book, setBook] = useState<AddBookType>({
        bookName: '',
        bookDesc: ''
    })
    const handleSubmit = (event: any) => {
        if (!book.bookName) return
        event.preventDefault();
        addBook(book).then((res: any) => { 
            let book = res?.payload
            callbackData(book)
         }).catch((err: any) => { 

         }).finally(() => {
            handleOpenChange(false)
        })
        
    }
    const handleOpenChange = (value: boolean) => {
        handleDialogVisible(value)
    }
    return (
        <Dialog open={dialogVisible} onOpenChange={(value) => handleOpenChange(value)}>
            <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('add_book.name')}</label>
                        <Input value={book.bookName} onChange={(e: any) =>
                            setBook({ ...book, bookName: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_book.name')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('add_book.description')}</label>
                        <Input value={book.bookDesc} onChange={(e: any) =>
                            setBook({ ...book, bookDesc: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_book.description')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <Button onClick={() => handleOpenChange(false)} type="button">{$t('common.close')}</Button>
                        <Button className='ml-[20px]' disabled={!book.bookName} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
