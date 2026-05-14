import SvgIcon from "@/icons/svg-icon";
import type { BookChapterType } from '@/type/chapter'
interface ChapterCardProps extends BookChapterType {
    
}
export default function ChapterCard({chapterName,chapterDesc}:ChapterCardProps) {
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
            <div className="flex items-center gap-3">
                {/* <button className="px-6 py-2.5 rounded-xl border-2 border-theme text-theme font-bold text-sm hover:bg-[#E6F6F4] transition-all active:scale-95">Review</button> */}
                <SvgIcon name="more" />
            </div>
        </div>
    );
};
