import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { $t } from "@/utils/index"
type AlertDialogTemplateProps = {
    visible?: boolean
    alertTitle?: string
    alertDescription?: string
    comfirmCallback?: () => void
    cancelCallback?: () => void
}
export default function AlertDialogTemplate({ visible=false, alertTitle, alertDescription, comfirmCallback, cancelCallback }: AlertDialogTemplateProps) {
    
    const handleComfirm = (e:any) => {
        e.stopPropagation()
        if(comfirmCallback) {
            comfirmCallback()
        }
    }

    const handleCancel = (e:any) => {
        e.stopPropagation()
        if(cancelCallback) {
            cancelCallback()
        }
    }
    return (
        <AlertDialog open={visible} >
            <AlertDialogContent onClick={(e)=>e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alertTitle || $t('common.default_alert_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {alertDescription || $t('common.default_alert_description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>{$t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleComfirm}>{$t('common.confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
