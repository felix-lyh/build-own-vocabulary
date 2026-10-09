import type { VocabularyDataType,AddVocaType,AddBookType } from '@/type/vocabulary'
import request from './index';
import type { BookChapterType,UpsertChapterType,DeleteChapterType } from '@/type/chapter'
type QueryVocabulary = Partial<VocabularyDataType>;

/**
 * manage book API functions
 */

export const getBooks = ({limit=0,page=1}:{limit:number,page:number}) => {
    return request({
        url: '/api/vocabulary/books',
        method: 'get',
        data: { limit, page },
    });
};

export const addBook = ({ bookName,bookDesc }:AddBookType) => {
    return request({
        url: '/api/vocabulary/books',
        method: 'post',
        data: { bookName,bookDesc },
    });
};

export const updateBook = ({id, bookName,bookDesc }:{ id:string,bookName:string,bookDesc:string }) => {
    return request({
        url: `/api/vocabulary/books/${id}`,
        method: 'put',
        data: { bookName,bookDesc },
    });
};

export const deleteBook = ({ bookId }:{ bookId:string }) => {
    return request({
        url: '/api/vocabulary/books',
        method: 'delete',
        data: { bookId },
    });
};

export const deleteBookList = ({ bookIdList }:{ bookIdList:string[] }) => {
    return request({
        url: '/api/vocabulary/books',
        method: 'delete',
        data: { bookIdList },
    });
};

/**
 * Manage chapter API functions
 */

export const getChapters = ({bookId,limit=0,page=1}:{bookId:string,limit:number,page:number}) => {
    return request({
        url: `/api/vocabulary/${bookId}/chapter`,
        method: 'get',
        params: { bookId,limit, page },
    });
};

export const addChapter = ({ bookId,chapterName,chapterDesc }:UpsertChapterType) => {
    return request({
        url: `/api/vocabulary/${bookId}/chapter`,
        method: 'post',
        data: { bookId,chapterName,chapterDesc },
    });
};

export const updateChapter = ({chapterId,chapterName,chapterDesc}:BookChapterType) => {
    return request({
        url: `/api/vocabulary/books/chapter`,
        method: 'put',
        data: { chapterName,chapterDesc },
    });
};

export const delChapter = ({chapterId}:DeleteChapterType) => {
    return request({
        url: `/api/vocabulary/books/chapter`,
        method: 'delete',
        data: { chapterId },
    });
};

export const deleteChapterList = ({chapterIdList}:{ chapterIdList:string[] }) => {
    return request({
        url: `/api/vocabulary/books/chapter`,
        method: 'delete',
        data: { chapterIdList },
    });
};

/**
 *  Manage vocabulary API functions
 */

export const addVocabulary = ({ vocabulary, translations = '', examples = '',bookId,chapterId }: AddVocaType) => {
    return request({
        url: `/api/vocabulary/${bookId}/${chapterId}/vocabulary`,
        method: 'post',
        data: { vocabulary, translations, examples, bookId, chapterId },
    });
};

export const updateVocabulary = (query: QueryVocabulary) => {
    return request({
        url: `/api/vocabulary/books/chapters/vocabulary`,
        method: 'put',
        data: query,
    });
};
export const getVocabularyList = ({ bookId,chapterId, page = 1, limit = 100, }: { bookId: string;chapterId:string; page?: number, limit?: number, sort?: Record<string, 1 | -1>; }) => {
    // with chapterId: /api/vocabulary/{bookId}/{chapterId}/vocabulary
    // without chapterId: /api/vocabulary/{bookId}/vocabulary (book level)
    const url = chapterId
        ? `/api/vocabulary/${bookId}/${chapterId}/vocabulary`
        : `/api/vocabulary/${bookId || 'all'}/vocabulary`;
    return request({
        url,
        method: 'get',
        params: { bookId,chapterId: chapterId || undefined, page, limit },
    });
};

export const deleteVocaList = (ids: string[]) => {
    return request({
        url: `/api/vocabulary/books/chapters/vocabulary`,
        method: 'delete',
        data:{
            ids
        }
    });
}

