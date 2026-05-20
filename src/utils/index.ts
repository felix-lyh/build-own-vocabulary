import i18n from 'i18next';

export function $t(key: string) {
    return i18n.t(key);
}

// copy text
export async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Copy failed', err)
    }
}

export const isOneWord = (text: string) => {
    return text.trim().split(/\s+/).length === 1
}
