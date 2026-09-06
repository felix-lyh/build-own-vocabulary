// UI feedback sounds served from /public/sounds
const soundMap = {
    correct: '/sounds/correct.wav',
    error: '/sounds/click-error.wav',
    click: '/sounds/click2.wav',
    flip: '/sounds/click1.wav',
} as const;

export type SoundName = keyof typeof soundMap;

export function playSound(name: SoundName) {
    try {
        const audio = new Audio(soundMap[name]);
        audio.volume = 0.6;
        audio.play().catch(() => {});
    } catch (err) {
        // ignore autoplay / unsupported errors
    }
}

// dedicated singleton for typing keystrokes: restarting one instance
// avoids piling up Audio objects during fast typing
let typeAudio: HTMLAudioElement | null = null;
export function playTypeSound() {
    try {
        if (!typeAudio) {
            typeAudio = new Audio('/sounds/click1.wav');
            typeAudio.volume = 0.35;
        }
        typeAudio.currentTime = 0;
        typeAudio.play().catch(() => {});
    } catch (err) {
        // ignore autoplay / unsupported errors
    }
}
