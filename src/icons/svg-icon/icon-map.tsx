import nextIcon from '../svg/next';
import vocabularyIcon from '../svg/vocabulary';
import infoTipsIcon from '../svg/info-tips';
import listeningIcon from '../svg/listening';
import notPassIcon from '../svg/not-pass';
import readingIcon from '../svg/reading';
import writingIcon from '../svg/writing';
import speakingIcon from '../svg/speaking';
import voicePlayer from '../svg/voice-player';
import stopVoice from '../svg/stop-voice';
import xmindIcon from '../svg/xmind';
import addFile from '../svg/add-file';
import addFolder from '../svg/add-folder';
import sendIcon from '../svg/send-icon'
import viewIcon from '../svg/view'
import noViewIcon from '../svg/no-view'
import upload from '../svg/upload'
import edit from '../svg/edit'
import completion from '../svg/completion';
import circleMore from '../svg/circle-more';
import more from '../svg/more';
export const iconMap = {
    edit,
    more,
    'not-pass': notPassIcon,
    'info-tips': infoTipsIcon,
    'voice-player':voicePlayer,
    'stop-voice':stopVoice,
    'circle-more': circleMore,
    next: nextIcon,
    vocabulary: vocabularyIcon,
    listening: listeningIcon,
    speaking: speakingIcon,
    reading: readingIcon,
    writing: writingIcon,
    xmind:xmindIcon,
    addFile,
    addFolder,
    sendIcon,
    viewIcon,
    noViewIcon,
    upload,
    completion,
};

export type IconName = keyof typeof iconMap;
