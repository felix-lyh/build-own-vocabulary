'use client'
const modifierKeyPrefix = () => {
    if(typeof window === 'undefined') {
        return 'Ctrl' // fallback for SSR
    }
    return '⌘'
    // return navigator.platform.startsWith('Mac') ||
    //     navigator.platform === 'iPhone'
    //     ? '⌘'
    //     : 'Ctrl'
}
export default {
    modifierKeyPrefix: modifierKeyPrefix()
}