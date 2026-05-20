'use client';
import SvgIcon from '@/icons/svg-icon';
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import UpsertArticleItem from './components/upsert-articleItem-dialog';
import { getArticleList } from '@/request/article';
import { ArticleItemType } from '@/type/article';
import { useRouter } from 'next/navigation'
export default function Page() {
    const [articleVisible, setArticleVisible] = useState(false)
    const [articleList, setArticleList] = useState<ArticleItemType[]>([])
    const router = useRouter()
    const updateArticleList = (data?:ArticleItemType) => {
        if(!!data){
            setArticleList([...articleList, data])
            return
        }
        getArticleList({limit:0,page:1}).then((res: any) => {
            let articleList = res?.payload || []
            setArticleList(articleList)
        }).catch((err: any) => {

        })
    }
    useEffect(() => {
        updateArticleList()
    }, [])
    return (
        <>
            <div className='flex justify-between'>
                <h3>{$t('reading_practice.header_desc')}</h3>
                <div onClick={() => setArticleVisible(true)} className='flex items-center cursor-pointer bg-primary rounded-lg text-[#fff] h-fit py-[8px] px-[10px]'>
                    <SvgIcon width={20} height={20} name='reading' color='#fff'></SvgIcon>
                    <span className='ml-[10px]'>{$t('add_article')}</span>
                </div>
            </div>
            
            <div className="">
                <ul>
                    {articleList.map((item: ArticleItemType) => (
                        <li key={item.articleId} className='px-[20px] py-[10px] mt-[20px] rounded-lg bg-white'>
                            <h2 onClick={()=>router.push(`/reading/${item.articleId}`)} className='text-xl mb-[10px] font-bold hover:underline cursor-pointer'>{item.articleName}</h2>
                            <p>{item.articleDesc}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <UpsertArticleItem 
                dialogVisible={articleVisible} 
                handleDialogVisible={setArticleVisible} 
                callbackData={updateArticleList}>
            </UpsertArticleItem>
        </>
    );
}
