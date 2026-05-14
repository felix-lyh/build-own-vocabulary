'use client'
import Link from 'next/link'
import SvgIcon from "@/icons/svg-icon";
import { $t } from '@/utils/index'

export default function BackBtn({path=''}:{path?:string}) {
    return (
        <Link href={path}>
            <div className='flex items-center text-lg text-gray-800 hover:text-gray-500'>
                <span className={'transform rotate-180'}><SvgIcon name="next" width={30}/></span>
                <span>{$t('common.back')}</span>
            </div>
        </Link>
    )
}
