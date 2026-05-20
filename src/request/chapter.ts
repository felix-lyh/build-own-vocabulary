import request from './index';
import type { BookChapterType,UpsertChapterType } from '@/type/chapter'
export const getChapters = ({bookId,limit=0,page=1}:{bookId:string,limit:number,page:number}) => {
    return request({
        url: '/api/chapter',
        method: 'get',
        params: { bookId,limit, page },
    });
};

export const addChapter = ({ bookId,chapterName,chapterDesc }:UpsertChapterType) => {
    return request({
        url: '/api/chapter',
        method: 'post',
        data: { bookId,chapterName,chapterDesc },
    });
};

export const updateChapter = ({chapterId,chapterName,chapterDesc}:BookChapterType) => {
    return request({
        url: `/api/chapter`,
        method: 'put',
        data: { chapterName,chapterDesc },
    });
};
