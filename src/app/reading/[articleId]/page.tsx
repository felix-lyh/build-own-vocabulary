'use client';
import { useEffect, useState } from 'react';
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
    const [loading, setLoading] = useState(true)
    const [article, setArticle] = useState<AreticleType | null>(null)

    const handleContent = (value: string) => {
        setArticle((pre) => pre ? { ...pre, content: value } : pre)
    }
    const getArticleFun = () => {
        getArticle(articleId).then((res: any) => {
            setArticle(res?.payload || null)
        }).catch(() => {
            setArticle(null)
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        setLoading(true)
        getArticleFun()
    }, [articleId])
    return (
        <>
            <HeaderBar
                needLogo={true}
                leftContent={<BackBtn path='/reading'></BackBtn>}
                rightContent={
                    <span onClick={() => setArticleVisible(true)} className='bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] rounded-lg text-sm text-[#fff] py-[8px] px-[10px] cursor-pointer shadow-md shadow-[#1ABC9C]/30 hover:brightness-105 active:scale-95 transition-all'>
                        {article?.content ? $t('reading.edit_content') : $t('upload_article')}
                    </span>
                }
            >
            </HeaderBar>
            {article && <ArticleContent {...article} onUpload={() => setArticleVisible(true)} />}
            {!loading && !article && <div className='w-[80%] relative mx-auto mt-[40px]'>
                <div onClick={() => setArticleVisible(true)} className="group bg-surface/50 border-2 border-dashed border-app-border rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-accent-soft/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <SvgIcon width={32} height={32} name='reading' color='#2EB7A3'></SvgIcon>
                    </div>
                    <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('empty_article')}</h3>
                    <p className="text-on-surface-variant text-label-md font-label-md">{$t('empty_article.desc')}</p>
                </div>
            </div>}
            <UploadArticle
                initialContent={article?.content || ''}
                dialogVisible={articleVisible}
                callbackData={handleContent}
                handleDialogVisible={setArticleVisible}>
            </UploadArticle>
        </>
    );
}
