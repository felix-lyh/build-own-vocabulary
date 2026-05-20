import { useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { $t } from '@/utils/index';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SvgIcon from '@/icons/svg-icon';
import { toast } from "sonner"
import { addArticle } from '@/request/article';
import { useParams } from 'next/navigation';
interface PropType {
    dialogVisible: boolean,
    callbackData: Function,
    handleDialogVisible: Function
}
export default function upsertArticleItem({ dialogVisible, callbackData, handleDialogVisible }: PropType) {
    const params = useParams()
    const articleId = params.articleId as string
    const [content, setContent] = useState<string>('')
    const [uploadType, setUploadType] = useState<'manual' | 'file'>('manual')
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleFileClick = () => {
        inputRef.current?.click()
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)

        try {
            const ext = file.name.split('.').pop()?.toLowerCase()
            if (ext === 'txt') {
                const text = await file.text()
                // For simple text files, create article via existing JSON API

            } else {
                // For non-text files, upload as FormData to a dedicated upload endpoint
                const form = new FormData()
                form.append('file', file)

                // const res = await fetch('/api/article/upload', { method: 'POST', body: form })
                // if (!res.ok) {
                //     throw new Error(`Upload failed ${res.status}`)
                // }
            }
        } catch (err: any) {
            toast.error(err?.message || 'Upload failed')
        } finally {
            // setUploading(false)
            // reset input so same file can be selected again
            if (inputRef.current) inputRef.current.value = ''
        }
    }
    const handleSubmit = (event: any) => {
        if (!content) return
        event.preventDefault();
        addArticle({articleId,content}).then(()=>{
            callbackData(content)
            handleDialogVisible(false)
        }).catch(err=>{

        })
    }

    return (
        <Dialog open={dialogVisible} onOpenChange={(value) => handleDialogVisible(value)}>
            <DialogContent className='max-w-[80%]' onPointerDownOutside={(event)=>event.preventDefault()}>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <form onSubmit={handleSubmit}>
                    <Select defaultValue={uploadType} value={uploadType} onValueChange={(v: 'manual' | 'file') => setUploadType(v)}>
                        <SelectTrigger className="w-full max-w-48 mb-[15px] ml-auto">
                            <SelectValue placeholder={$t('add_article.file_type')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="manual">{$t('upload_type.manual_input')}</SelectItem>
                                <SelectItem value="file">{$t('upload_type.file_input')}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {uploadType === 'file' && <div className='relative'>
                        <div onClick={handleFileClick} className="group bg-white/50 border-2 border-dashed border-[#E9ECEF] rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-[#E6F6F4]/20 hover:border-[#2EB7A3] transition-all cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-[#E6F6F4] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <SvgIcon width={32} height={32} name='upload' color='#2EB7A3'></SvgIcon>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">{$t('upload_article')}</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md">{$t('upload_article.desc')}</p>
                        </div>
                        <input ref={inputRef} onChange={handleFileChange} type="file" name='upload-input' accept=".txt,.doc,.docx" className='hidden' />
                    </div>}
                    {uploadType === 'manual' && <Textarea rows={8} value={content} onChange={(e: any) =>
                        setContent(e.target.value )
                    } className='' placeholder={$t('add_article.content')}></Textarea>}
                    <div className='flex justify-end mt-[20px]'>
                        <Button onClick={() => handleDialogVisible(false)} type="button">{$t('common.close')}</Button>
                        <Button className='ml-[20px]' disabled={!content} type='submit'>{$t('common.upload')}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
