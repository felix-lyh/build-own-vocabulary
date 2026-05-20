'use client';
import { useEffect, useRef, useState } from 'react';
import { $t } from '@/utils/index';
import { AreticleType } from '@/type/article';
import SvgIcon from '@/icons/svg-icon';
import HeaderBar from '@/components/header-bar';
import BackBtn from '@/components/back-btn';
import { getArticle } from '@/request/article';
import UploadArticle from '../components/upload-article'
import { useParams } from 'next/navigation';
import ArticleContent from '../components/article-content';
export default function Page() {
    const params = useParams()
    const articleId = params.articleId as string
    const [articleVisible, setArticleVisible] = useState(false)
    const [article, setArticle] = useState<AreticleType>({
        articleId,
        content: '',
        articleName:'',
        articleDesc:'',
        createTime: Date.now(),
        update: Date.now()
    })

    const handleContent = (value:string)=>{
        setArticle((pre)=>{
            return {...pre,contetn:value}
        })
    }
    const getArticleFun = ()=>{
        getArticle(articleId).then((res:any)=>{
            let article = res?.payload || null
            setArticle(article)
        }).catch(err=>{

        })
    }
    useEffect(()=>{
        getArticleFun()
    },[articleId])
    return (
        <>
            <HeaderBar
                needLogo={true}
                leftContent={<BackBtn path='/reading'></BackBtn>}
                rightContent={
                    <span onClick={() => setArticleVisible(true)} className='bg-primary rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer' >{$t('upload_article')}</span>
                }
            >
            </HeaderBar>
            <ArticleContent {...article}/>
            { !article && <div className='w-[80%] relative mx-auto mt-[40px]'>
                <div onClick={()=>setArticleVisible(true)} className="group bg-white/50 border-2 border-dashed border-[#E9ECEF] rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-[#E6F6F4]/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-[#E6F6F4] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <SvgIcon width={32} height={32} name='reading' color='#2EB7A3'></SvgIcon>
                    </div>
                    <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('empty_article')}</h3>
                    <p className="text-on-surface-variant text-label-md font-label-md">{$t('empty_article.desc')}</p>
                </div>
            </div>}
            <UploadArticle dialogVisible={articleVisible} callbackData={handleContent} handleDialogVisible={setArticleVisible}></UploadArticle>
        </>
    );
}
