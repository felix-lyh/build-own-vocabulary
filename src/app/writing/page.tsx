'use client'
import { useState } from "react";
import { $t } from '@/utils/index'
import SvgIcon from '@/icons/svg-icon';

export default function Page() {
    const [bookVisible, setBookVisible] = useState(false)
    return (
        <div className="flex flex-col h-full">
            <div className='flex justify-between'>
                <h3>{$t('writing.page.header_desc')}</h3>
                <div onClick={() => setBookVisible(true)} className='flex items-center cursor-pointer bg-primary rounded-lg text-[#fff] h-fit py-[8px] px-[10px]'>
                    <SvgIcon width={20} height={20} name='vocabulary' color='#fff'></SvgIcon>
                    <span className='ml-[10px]'>{$t('add_vocabulary_book')}</span>
                </div>
            </div>
        </div>
    );
}
