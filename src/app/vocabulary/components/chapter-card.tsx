import SvgIcon from "@/icons/svg-icon";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import type { BookChapterType } from '@/type/chapter'

import { $t } from '@/utils/index'
interface ChapterCardProps extends BookChapterType {
    callback?: (p: string) => void
}

export default function ChapterCard({ chapterId, chapterName, chapterDesc, callback }: ChapterCardProps) {
    return (
        <div className="group bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(29,43,41,0.04)] border border-zinc-100 hover:shadow-[0_12px_28px_rgba(26,188,156,0.14)] hover:border-[#1ABC9C]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 w-full cursor-pointer">
            <div className="shrink-0 rounded-2xl w-12 h-12 bg-gradient-to-br from-[#E6F6F4] to-[#CFF0EA] flex items-center justify-center group-hover:from-[#1ABC9C] group-hover:to-[#0E8C74] transition-all duration-300">
                <span className="text-[#1ABC9C] group-hover:text-white transition-colors">
                    <SvgIcon name="vocabulary" width={22} />
                </span>
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-headline-lg text-lg font-bold text-zinc-800 truncate">{chapterName}</h3>
                {chapterDesc && <p className="text-xs text-zinc-400 mt-0.5 truncate">{chapterDesc}</p>}
            </div>
            <span className="shrink-0 text-[#1ABC9C] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                <SvgIcon name="next" width={18} />
            </span>
            <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()} >
                <Popover>
                    <PopoverTrigger asChild>
                        <span className='flex justify-center items-center cursor-pointer p-[8px] ml-auto text-zinc-400 hover:bg-theme hover:text-[#fff] rounded-[6px] transition-colors'><SvgIcon name="more" /></span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit py-[6px] px-0">
                        <ul>
                            <li className='cursor-pointer px-[10px] py-1 text-red-500 hover:bg-red-500 hover:text-[#fff]'
                            onClick={() => callback && callback(chapterId)}>{$t('delete_btn')}</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    );
};
