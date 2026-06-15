import { useState } from "react";
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
        <div className="group bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(29,43,41,0.04)] border border-zinc-100 hover:shadow-[0_8px_20px_rgba(29,43,41,0.08)] transition-all flex items-center gap-6 w-full">
            <div className="rounded-full w-[40px] h-[40px] bg-[#E6F6F4] flex items-center justify-center">
                <span className="text-theme">
                    <SvgIcon name="circle-more" />
                    {/* <SvgIcon name="completion" /> */}
                </span>
            </div>
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-headline-lg text-lg">{chapterName}</h3>
                    <span className="text-xs font-label-sm text-zinc-400">42 words</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-theme h-full w-full"></div>
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] uppercase font-bold text-theme">Mastered</span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">100% Mastery</span>
                </div>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()} >
                {/* <button className="px-6 py-2.5 rounded-xl border-2 border-theme text-theme font-bold text-sm hover:bg-[#E6F6F4] transition-all active:scale-95">Review</button> */}

                <Popover>
                    <PopoverTrigger asChild>
                        <span className='flex justify-center items-center cursor-pointer p-[8px] ml-auto leading-[10px] hover:bg-theme hover:text-[#fff] rounded-[6px]'><SvgIcon name="more" /></span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit py-[6px] px-0">
                        <ul>

                            <li className='cursor-pointer px-[10px] text-red-500 hover:bg-red-500 hover:text-[#fff]' 
                            onClick={() => callback && callback(chapterId)}>{$t('delete_btn')}</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    );
};
