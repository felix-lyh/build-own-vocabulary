import type { VocabularyDataType,AddVocaType } from '@/type/vocabulary'
import request from './index';

type QueryVocabulary = Partial<VocabularyDataType>;


export const addVocabulary = ({ vocabulary, translations = '', examples = '',bookId,chapterId }: AddVocaType) => {
    return request({
        url: '/api/vocabulary',
        method: 'post',
        data: { vocabulary, translations, examples, bookId, chapterId },
    });
};

export const updateVocabulary = (query: QueryVocabulary) => {
    return request({
        url: `/api/vocabulary`,
        method: 'put',
        data: query,
    });
};
export const getVocabularyList = ({ bookId,chapterId, page = 1, limit = 100, }: { bookId: string;chapterId:string; page?: number, limit?: number, sort?: Record<string, 1 | -1>; }) => {
    return request({
        url: '/api/vocabulary',
        method: 'get',
        params: { bookId,chapterId, page, limit },
    });
};

export const deleteOneVoca = (id: string) => {
    return request({
        url: `/api/vocabulary`,
        method: 'delete',
        data:{
            id
        }
    });
}

export const deleteManyVoca = (idList: string[]) => {
    return request({
        url: `/api/vocabulary`,
        method: 'delete',
        data: { idList }
    });
}
