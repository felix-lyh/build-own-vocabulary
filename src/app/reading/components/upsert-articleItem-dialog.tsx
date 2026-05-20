
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import { $t } from '@/utils/index';
import type { UpsertArticleItemType } from '@/type/article'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addArticleListItem } from '@/request/article'
interface PropType {
    dialogVisible: boolean,
    callbackData: Function,
    handleDialogVisible: Function
}
export default function upsertArticleItem({ dialogVisible, callbackData, handleDialogVisible }: PropType) {
    const [articleItem, setArticleItem] = useState<UpsertArticleItemType>({
        articleName: '',
        articleDesc: ''
    })
    const handleSubmit = (event: any) => {
        if (!articleItem.articleName) return
        event.preventDefault();
        addArticleListItem(articleItem).then((res: any) => { 
            let articleItem = res?.payload
            callbackData(articleItem)
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
                        <label>{$t('add_article.name')}</label>
                        <Input value={articleItem.articleName} onChange={(e: any) =>
                            setArticleItem({ ...articleItem, articleName: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_article.name')}></Input>
                    </div>
                    <div className='flex items-center mt-[20px]'>
                        <label>{$t('add_article.desc')}</label>
                        <Input value={articleItem.articleDesc} onChange={(e: any) =>
                            setArticleItem({ ...articleItem, articleDesc: e.target.value })
                        } className='flex-1 ml-[15px]' placeholder={$t('add_article.desc')}></Input>
                    </div>
                    <div className='flex justify-end mt-[20px]'>
                        <Button onClick={() => handleOpenChange(false)} type="button">{$t('common.close')}</Button>
                        <Button className='ml-[20px]' disabled={!articleItem.articleName} type='submit'>{$t('common.save')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
