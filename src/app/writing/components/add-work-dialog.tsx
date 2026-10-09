"use client";
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { $t } from '@/utils/index';
import type { AddWorkType } from '@/type/writing'
import { addWork } from '@/request/writing'

interface PropType {
    dialogVisible: boolean,
    callbackData: Function,
    handleDialogVisible: Function
}
export default function AddWorkDialog({ dialogVisible, callbackData, handleDialogVisible }: PropType) {
    const [work, setWork] = useState<AddWorkType>({
        workName: '',
        workDesc: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const handleSubmit = (event: any) => {
        if (!work.workName || submitting) return
        event.preventDefault();
        setSubmitting(true)
        addWork(work).then((res: any) => {
            callbackData(res?.payload)
            setWork({ workName: '', workDesc: '' })
        }).catch(() => {

        }).finally(() => {
            setSubmitting(false)
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
                        <label>{$t('add_works.name')}</label>
                        <Input value={work.workName} onChange={(e: any) =>
                            setWork({ ...work, workName: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_works.name_ph')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('add_works.desc')}</label>
                        <Input value={work.workDesc} onChange={(e: any) =>
                            setWork({ ...work, workDesc: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_works.desc')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <Button onClick={() => handleOpenChange(false)} type="button">{$t('common.close')}</Button>
                        <Button className='ml-[20px]' disabled={!work.workName || submitting} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
