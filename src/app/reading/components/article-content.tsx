import SvgIcon from '@/icons/svg-icon';
import { $t } from '@/utils/index';
import { AreticleType } from '@/type/article';
interface PropsType extends AreticleType {
    onUpload?: () => void
}

const formatDate = (ts?: number) => {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function ArticleContent({ articleName, articleDesc, content, createTime, update, onUpload }: PropsType) {
    const wordCount = content?.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0
    const readMinutes = Math.max(1, Math.ceil(wordCount / 200))
    return (
        <div className='w-[85%] max-w-[900px] mx-auto py-[24px] h-[calc(100vh-100px)] overflow-auto'>
            <article className='bg-surface rounded-2xl border border-app-border shadow-[0_4px_12px_rgba(29,43,41,0.06)] overflow-hidden'>
                <div className='h-[6px] w-full bg-gradient-to-r from-[#1ABC9C] to-[#0E8C74]'></div>
                <header className='px-6 sm:px-10 pt-8 pb-6 border-b border-app-border'>
                    <div className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong'>
                        <SvgIcon width={16} height={16} name='reading' color='#0E8C74'></SvgIcon>
                        <span>{$t('reading')}</span>
                    </div>
                    <h1 className='mt-3 text-2xl sm:text-3xl font-bold leading-tight text-on-surface'>{articleName}</h1>
                    {articleDesc && <p className='mt-2 text-sm text-app-fg-muted leading-relaxed'>{articleDesc}</p>}
                    <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-app-fg-muted'>
                        {!!(update || createTime) && <span>{formatDate(update || createTime)}</span>}
                        <span>{wordCount} {$t('reading.word_unit')}</span>
                        <span>{$t('reading.read_time')} {readMinutes} {$t('reading.minutes')}</span>
                    </div>
                </header>
                {
                    content ?
                        <div className='px-6 sm:px-10 py-8 text-[16px] leading-8 text-on-surface whitespace-pre-wrap break-words'>{content}</div>
                        :
                        <div onClick={onUpload} className="m-6 sm:m-10 bg-surface/50 border-2 border-dashed border-app-border rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-accent-soft/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4">
                                <SvgIcon width={32} height={32} name='reading' color='#2EB7A3'></SvgIcon>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('empty_article')}</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md">{$t('reading.empty_content')}</p>
                        </div>
                }
            </article>
        </div>
    );
};
