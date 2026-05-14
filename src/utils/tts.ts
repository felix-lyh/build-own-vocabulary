"use client";

// import axios from "axios";

export function getVoicesAsync() {
    return new Promise((resolve) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) return resolve(voices);

        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            resolve(voices);
        };
    });
}
export async function speakWithVoice(text: string, onStart?: () => void, onEnd?: () => void,voiceName = 'Samantha') {
    const voices: any = await getVoicesAsync();
    const selected = voices?.find((v: any) => v.name === voiceName);
    const utter = new SpeechSynthesisUtterance(text);
    if (selected) utter.voice = selected;
    utter.lang = selected?.lang || 'en-US';
    utter.rate = 1
    utter.onstart = () => {
        console.log('TTS start play');
        onStart?.();
    };
    utter.onend = () => {
        onEnd?.()
    };
    utter.onerror = (err) => {
        console.error(err)
        onEnd?.()
    }; // ending when it error
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }
    speechSynthesis.speak(utter);
}
export function stopVoice() {
    speechSynthesis.cancel();
}

// https://dict.youdao.com/pronounce/base
// export async function speakWithVoice(text: string, onStart?: () => void, onEnd?: () => void, voiceName = 'Samantha') {
//     axios.get('https://dict.youdao.com/pronounce/base',{
//         params: {
//             audio: text,
//             type: '2'
//         },
//         responseType: 'blob'
//     }).then((response) => {
//         const audioUrl = URL.createObjectURL(response.data);
//         const audio = new Audio(audioUrl);
//         audio.play();
//     }).catch((error) => {
//         console.error('Error fetching audio:', error);
//     });
// }