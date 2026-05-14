import { useEffect, useState } from "react";
import { speakWithVoice } from '@/utils/tts'
import SvgIcon from "@/icons/svg-icon";
interface PropType {
    voiceValue:string;
    className?:string;
    needInitVoice?:boolean;
}
export default function PlayVoice({voiceValue,needInitVoice = true,className = ''}:PropType) {
    const [isplayVoice, setPlayVoice] = useState(false)
    const controlVoicePlayer = async () => {
        // if (isplayVoice) {
        //     stopVoice()
        //     setPlayVoice(false)
        //     return
        // }
        await speakWithVoice(voiceValue)
    }
    useEffect(()=>{
        if(needInitVoice){
            controlVoicePlayer()
        }
    },[voiceValue])
    return (
        <div className={`flex justify-center items-center w-[35px] h-[35px] cursor-pointer ${className}`} onClick={controlVoicePlayer}>
            {isplayVoice ? <SvgIcon name="stop-voice" width={25}></SvgIcon> : <SvgIcon name="voice-player" width={25}></SvgIcon>}
        </div>
    );
};