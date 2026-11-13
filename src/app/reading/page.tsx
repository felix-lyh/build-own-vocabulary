'use client';
import SvgIcon from '@/icons/svg-icon';
import { useEffect, useState } from 'react';
import { $t } from '@/utils/index';
import UpsertArticleItem from './components/upsert-articleItem-dialog';
import { getArticleList, deleteArticle, deleteArticleList } from '@/request/article';
import { ArticleItemType } from '@/type/article';
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import AlertDialogTemplate from '@/components/alert-dialog-template';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const formatDate = (ts?: number) => {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Page() {
    const [articleVisible, setArticleVisible] = useState(false)
    const [articleList, setArticleList] = useState<ArticleItemType[]>([])
    const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
    const [isEditState, setIsEditState] = useState(false)
    const router = useRouter()
    const updateArticleList = (data?: ArticleItemType) => {
        if (!!data) {
            setArticleList([data, ...articleList])
            return
        }
        getArticleList({ limit: 0, page: 1 }).then((res: any) => {
            let articleList = res?.payload || []
            setArticleList(articleList)
        }).catch(() => {

        })
    }
    const handleSelectArticle = (articleId: string, checked: boolean) => {
        setSelectedArticleIds(pre => checked ? [...pre, articleId] : pre.filter(id => id !== articleId))
    }
    const allSelected = articleList.length > 0 && selectedArticleIds.length === articleList.length
    const handleSelectAll = (checked: boolean) => {
        setSelectedArticleIds(checked ? articleList.map(article => article.articleId) : [])
    }
    const toggleEditState = () => {
        setIsEditState(pre => {
            if (pre) setSelectedArticleIds([])
            return !pre
        })
    }
    const handleDeleteArticle = (articleId: string) => {
        if (!articleId) return
        setPendingDeleteIds([articleId])
    }
    const handleDeleteSelected = () => {
        if (!selectedArticleIds.length) return
        setPendingDeleteIds(selectedArticleIds)
    }
    const confirmDeleteArticle = () => {
        const ids = pendingDeleteIds
        if (!ids.length) return
        const req = ids.length === 1 ? deleteArticle(ids[0]) : deleteArticleList(ids)
        req.then(() => {
            setArticleList(articleList.filter(article => !ids.includes(article.articleId)))
            setSelectedArticleIds(pre => pre.filter(id => !ids.includes(id)))
        }).catch(() => {

        }).finally(() => {
            setPendingDeleteIds([])
        })
    }
    useEffect(() => {
        updateArticleList()
    }, [])
    return (
        <>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] shadow-lg shadow-[#1ABC9C]/30 flex items-center justify-center'>
                        <SvgIcon width={24} height={24} name='reading' color='#fff'></SvgIcon>
                    </div>
                    <div className='min-w-0'>
                        <h3 className='font-headline-lg font-bold text-xl text-on-surface'>{$t('reading')}</h3>
                        <p className='text-sm text-app-fg-muted mt-0.5 max-w-xl'>{$t('reading_practice.header_desc')}</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 shrink-0'>
                    {articleList.length > 0 &&
                        <div onClick={toggleEditState} className='flex items-center cursor-pointer bg-surface border border-[#1ABC9C]/50 text-accent-strong rounded-xl h-fit py-[8px] px-4 text-sm font-medium shadow-sm hover:bg-accent-soft/40 hover:border-[#1ABC9C] active:scale-95 transition-all'>
                            <SvgIcon width={18} height={18} name='edit' color='#0E8C74'></SvgIcon>
                            <span className='ml-2'>{isEditState ? $t('complete_btn') : $t('edit_btn')}</span>
                        </div>
                    }
                    <div onClick={() => setArticleVisible(true)} className='flex items-center shrink-0 cursor-pointer bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74] rounded-xl text-[#fff] h-fit py-[9px] px-4 text-sm font-medium shadow-md shadow-[#1ABC9C]/30 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all'>
                        <SvgIcon width={18} height={18} name='reading' color='#fff'></SvgIcon>
                        <span className='ml-2'>{$t('add_article')}</span>
                    </div>
                </div>
            </div>
            {isEditState && articleList.length > 0 &&
                <div className='mt-4 flex items-center justify-between'>
                    <label className='flex items-center gap-2 cursor-pointer select-none' onClick={(e) => e.preventDefault()}>
                        <Checkbox checked={allSelected} onCheckedChange={(checked) => handleSelectAll(checked === true)} />
                        <span className='text-sm text-app-fg-muted'>{$t('select_all')}</span>
                    </label>
                    <Button disabled={!selectedArticleIds.length} onClick={handleDeleteSelected} className='bg-red-500 hover:bg-red-600 text-white'>
                        {$t('delete_btn')}{selectedArticleIds.length ? ` (${selectedArticleIds.length})` : ''}
                    </Button>
                </div>
            }
            <div className='mt-6 h-full'>
                {
                    articleList.length ?
                        <ul className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5'>
                            {articleList.map((item: ArticleItemType) => (
                                <li key={item.articleId} onClick={() => router.push(`/reading/${item.articleId}`)} className='h-full'>
                                    <div className='group relative h-full bg-surface border border-app-border rounded-2xl p-5 shadow-[0_4px_12px_rgba(29,43,41,0.06)] overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 transition-all duration-300'>
                                        <div className='absolute left-0 top-5 bottom-5 w-[4px] rounded-r-full bg-gradient-to-b from-[#1ABC9C] to-[#0E8C74] opacity-70'></div>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex items-center gap-3'>
                                                {isEditState &&
                                                    <span onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox checked={selectedArticleIds.includes(item.articleId)} onCheckedChange={(checked) => handleSelectArticle(item.articleId, checked === true)} />
                                                    </span>
                                                }
                                                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#1ABC9C] to-[#0E8C74] flex items-center justify-center shadow-md shadow-[#1ABC9C]/30'>
                                                    <SvgIcon width={20} height={20} name='reading' color='#fff'></SvgIcon>
                                                </div>
                                            </div>
                                            <div className='opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e) => e.stopPropagation()}>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <span className='flex justify-center items-center cursor-pointer p-[6px] text-app-fg-muted hover:bg-surface-muted hover:text-app-fg rounded-[6px] transition-colors'>
                                                            <SvgIcon name="more" />
                                                        </span>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-fit py-[6px] px-0">
                                                        <ul>
                                                            <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]'
                                                                onClick={() => handleDeleteArticle(item.articleId)}>{$t('delete_btn')}</li>
                                                        </ul>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className='mt-4 min-w-0'>
                                            <h4 className='text-lg font-bold leading-snug line-clamp-2 text-on-surface group-hover:text-accent-strong transition-colors'>{item.articleName}</h4>
                                            {item.articleDesc && <p className='mt-1.5 text-sm text-app-fg-muted leading-relaxed line-clamp-2'>{item.articleDesc}</p>}
                                        </div>
                                        <div className='mt-auto pt-4 flex items-center justify-between text-[11px] text-app-fg-muted'>
                                            <span>{formatDate(item.update)}</span>
                                            <span className='flex items-center gap-1.5 font-semibold text-accent-strong'>
                                                {$t('reading.continue')}
                                                <SvgIcon width={14} height={14} name='next' color='#0E8C74'></SvgIcon>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        :
                        <div onClick={() => setArticleVisible(true)} className="group mt-[65px] bg-surface/50 border-2 border-dashed border-app-border rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-accent-soft/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <SvgIcon width={32} height={32} name='reading' color='#2EB7A3'></SvgIcon>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('add_article')}</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md">{$t('upload_article.desc')}</p>
                        </div>
                }
            </div>
            <UpsertArticleItem
                dialogVisible={articleVisible}
                handleDialogVisible={setArticleVisible}
                callbackData={updateArticleList}>
            </UpsertArticleItem>
            <AlertDialogTemplate
                visible={!!pendingDeleteIds.length}
                alertTitle={pendingDeleteIds.length === 1 ? $t('article.delete_alert_title') : $t('common.default_alert_title')}
                alertDescription={pendingDeleteIds.length === 1 ? $t('article.delete_alert_desc') : $t('common.default_alert_description')}
                comfirmCallback={confirmDeleteArticle}
                cancelCallback={() => setPendingDeleteIds([])}>
            </AlertDialogTemplate>
        </>
    );
}
