'use client'
import { useEffect, useState } from "react";
import { $t } from '@/utils/index';
import SvgIcon from '@/icons/svg-icon';
import { useRouter } from 'next/navigation';
import type { WorkType } from '@/type/writing'
import { getWorks, deleteWork, deleteWorkList } from '@/request/writing'
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import AddWorkDialog from './components/add-work-dialog';
import WorkCard from './components/work-card';
import AlertDialogTemplate from '@/components/alert-dialog-template';

export default function Page() {
    const router = useRouter()
    const [workVisible, setWorkVisible] = useState(false)
    const [workList, setWorkList] = useState<WorkType[]>([])
    const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([])
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
    const [isEditState, setIsEditState] = useState(false)
    const addWorkCallBack = (data: WorkType) => {
        if (!data?.workId) return
        setWorkList([data, ...workList])
    }
    const getWorkList = () => {
        getWorks({ limit: 0, page: 1 }).then((res: any) => {
            setWorkList(res?.payload || [])
        }).catch(() => {

        })
    }
    const handleSelectWork = (workId: string, checked: boolean) => {
        setSelectedWorkIds(pre => checked ? [...pre, workId] : pre.filter(id => id !== workId))
    }
    const allSelected = workList.length > 0 && selectedWorkIds.length === workList.length
    const handleSelectAll = (checked: boolean) => {
        setSelectedWorkIds(checked ? workList.map(work => work.workId) : [])
    }
    const toggleEditState = () => {
        setIsEditState(pre => {
            if (pre) setSelectedWorkIds([])
            return !pre
        })
    }
    const handleDeleteWork = (workId: string) => {
        if (!workId) return
        setPendingDeleteIds([workId])
    }
    const handleDeleteSelected = () => {
        if (!selectedWorkIds.length) return
        setPendingDeleteIds(selectedWorkIds)
    }
    const confirmDeleteWork = () => {
        const ids = pendingDeleteIds
        if (!ids.length) return
        const req = ids.length === 1 ? deleteWork(ids[0]) : deleteWorkList(ids)
        req.then(() => {
            setWorkList(workList.filter(work => !ids.includes(work.workId)))
            setSelectedWorkIds(pre => pre.filter(id => !ids.includes(id)))
        }).catch(() => {

        }).finally(() => {
            setPendingDeleteIds([])
        })
    }
    useEffect(() => {
        getWorkList()
    }, [])
    return (
        <div className="flex flex-col h-full">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center'>
                        <SvgIcon width={24} height={24} name='writing' color='#fff'></SvgIcon>
                    </div>
                    <div className='min-w-0'>
                        <h3 className='font-headline-lg font-bold text-xl text-on-surface'>{$t('writing')}</h3>
                        <p className='text-sm text-zinc-500 mt-0.5 max-w-xl'>{$t('writing.page.header_desc')}</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 shrink-0'>
                    {workList.length > 0 &&
                        <div onClick={toggleEditState} className='flex items-center cursor-pointer bg-white border border-[#8B5CF6]/50 text-[#6D28D9] rounded-xl h-fit py-[8px] px-4 text-sm font-medium shadow-sm hover:bg-[#F3E8FF] hover:border-[#8B5CF6] active:scale-95 transition-all'>
                            <SvgIcon width={18} height={18} name='edit' color='#6D28D9'></SvgIcon>
                            <span className='ml-2'>{isEditState ? $t('complete_btn') : $t('edit_btn')}</span>
                        </div>
                    }
                    <div onClick={() => setWorkVisible(true)} className='flex items-center shrink-0 cursor-pointer bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-xl text-[#fff] h-fit py-[9px] px-4 text-sm font-medium shadow-md shadow-[#8B5CF6]/30 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all'>
                        <SvgIcon width={18} height={18} name='writing' color='#fff'></SvgIcon>
                        <span className='ml-2'>{$t('add_works.btn')}</span>
                    </div>
                </div>
            </div>
            {isEditState && workList.length > 0 &&
                <div className='mt-4 flex items-center justify-between'>
                    <label className='flex items-center gap-2 cursor-pointer select-none' onClick={(e) => e.preventDefault()}>
                        <Checkbox checked={allSelected} onCheckedChange={(checked) => handleSelectAll(checked === true)} />
                        <span className='text-sm text-zinc-600'>{$t('select_all')}</span>
                    </label>
                    <Button disabled={!selectedWorkIds.length} onClick={handleDeleteSelected} className='bg-red-500 hover:bg-red-600 text-white'>
                        {$t('delete_btn')}{selectedWorkIds.length ? ` (${selectedWorkIds.length})` : ''}
                    </Button>
                </div>
            }
            <div className='mt-6 h-full'>
                {
                    workList.length ?
                        <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
                            {workList.map((work, index) =>
                                <li key={work.workId} onClick={() => router.push(`/writing/${work.workId}`)}>
                                    <WorkCard {...work} index={index}
                                        onDelete={handleDeleteWork}
                                        isEditState={isEditState}
                                        isChecked={selectedWorkIds.includes(work.workId)}
                                        onSelectChange={handleSelectWork}>
                                    </WorkCard>
                                </li>)}
                        </ul>
                        :
                        <div onClick={() => setWorkVisible(true)} className="group mt-[65px] bg-white/50 border-2 border-dashed border-[#E9ECEF] rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-[#F3E8FF]/30 hover:border-[#8B5CF6] transition-all cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <SvgIcon width={32} height={32} name='addFile' color='#8B5CF6'></SvgIcon>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('add_works.btn')}</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md">{$t('writing.page.empty_state.desc')}</p>
                        </div>
                }
            </div>
            <AddWorkDialog
                dialogVisible={workVisible}
                callbackData={addWorkCallBack}
                handleDialogVisible={setWorkVisible}>
            </AddWorkDialog>
            <AlertDialogTemplate
                visible={!!pendingDeleteIds.length}
                alertTitle={pendingDeleteIds.length === 1 ? $t('writing.delete_alert_title') : $t('common.default_alert_title')}
                alertDescription={pendingDeleteIds.length === 1 ? $t('writing.delete_alert_desc') : $t('common.default_alert_description')}
                comfirmCallback={confirmDeleteWork}
                cancelCallback={() => setPendingDeleteIds([])}>
            </AlertDialogTemplate>
        </div>
    );
}
