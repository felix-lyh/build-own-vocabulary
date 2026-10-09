import SvgIcon from "@/icons/svg-icon";
import { $t } from '@/utils/index';
import type { WorkType } from '@/type/writing'
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface WorkCardProps extends WorkType {
    index: number;
    onDelete?: (workId: string) => void
    isEditState?: boolean
    isChecked?: boolean
    onSelectChange?: (workId: string, checked: boolean) => void
}

// cycling accent colors so each work card feels distinct
const CARD_ACCENTS = [
    'from-[#8B5CF6] to-[#6D28D9]',
    'from-[#F59E0B] to-[#D97706]',
    'from-[#EC4899] to-[#BE185D]',
    'from-[#0EA5E9] to-[#0369A1]',
    'from-[#10B981] to-[#047857]',
    'from-[#F43F5E] to-[#9F1239]',
]

const formatDate = (ts: number) => {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function WorkCard({ workId, workName, workDesc, content, update, index, onDelete, isEditState = false, isChecked = false, onSelectChange }: WorkCardProps) {
    const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0
    return (
        <div className="group relative w-full aspect-[4/5] rounded-2xl bg-white border border-zinc-100 shadow-[0_4px_12px_rgba(29,43,41,0.06)] overflow-hidden cursor-pointer p-5 flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300">
            {/* top accent bar */}
            <div className={`absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r ${accent}`}></div>
            {/* folded corner */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-zinc-100 border-l-transparent group-hover:border-t-zinc-200 transition-all"></div>
            {/* monogram watermark */}
            <span className='absolute -right-2 bottom-6 text-[110px] leading-none font-black text-zinc-100 select-none pointer-events-none'>
                {workName?.charAt(0)?.toUpperCase()}
            </span>

            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                    {isEditState &&
                        <span onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isChecked} onCheckedChange={(checked) => onSelectChange && onSelectChange(workId, checked === true)} />
                        </span>
                    }
                    <div className={`self-start w-10 h-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}>
                        <SvgIcon width={20} height={20} name='writing' color='#fff'></SvgIcon>
                    </div>
                </div>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e) => e.stopPropagation()}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <span className='flex justify-center items-center cursor-pointer p-[6px] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 rounded-[6px] transition-colors'>
                                <SvgIcon name="more" />
                            </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit py-[6px] px-0">
                            <ul>
                                <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]'
                                    onClick={() => onDelete && onDelete(workId)}>{$t('delete_btn')}</li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className='mt-4 relative min-w-0'>
                <h4 className='font-headline-lg text-base sm:text-lg font-bold leading-snug line-clamp-2 text-on-surface'>{workName}</h4>
                {workDesc && <p className='mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2 hidden sm:block'>{workDesc}</p>}
            </div>

            {/* fake text lines to suggest a written document */}
            <div className='mt-4 space-y-2 hidden sm:block'>
                <div className='h-1.5 rounded-full bg-zinc-100 w-full'></div>
                <div className='h-1.5 rounded-full bg-zinc-100 w-11/12'></div>
                <div className='h-1.5 rounded-full bg-zinc-100 w-4/5'></div>
            </div>

            <div className='mt-auto relative flex items-center justify-between text-[11px] text-zinc-400'>
                <span>{formatDate(update)}</span>
                <span>{wordCount} {$t('writing.words')}</span>
            </div>
            <div className='mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0E8C74] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300'>
                <span>{$t('writing.continue')}</span>
                <SvgIcon width={14} height={14} name='next' color='#0E8C74'></SvgIcon>
            </div>
        </div>
    );
};
