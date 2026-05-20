import request from './index';
import type { UpsertArticleItemType,UpsertAreticleType } from '@/type/article'
export const getArticleList = ({limit=0,page=1}:{limit:number,page:number}) => {
    return request({
        url: '/api/articleList',
        method: 'get',
        params: { limit, page }
    });
}

export const addArticleListItem = ({ articleName,articleDesc }: UpsertArticleItemType) => {
    return request({
        url: '/api/articleList',
        method: 'post',
        data: { articleName,articleDesc },
    });
};
export const updateArticleListItem = ({ articleId,articleName,articleDesc }: UpsertArticleItemType) => {
    return request({
        url: '/api/articleList',
        method: 'put',
        data: { articleId,articleName,articleDesc }
    });
};

export const getArticle = (articleId:string)=>{
    return request({
        url: `/api/articleList/${articleId}`,
        method: 'get'
    });
}

export const addArticle = ({articleId,content}:UpsertAreticleType)=>{
    return request({
        url: `/api/articleList/${articleId}`,
        method: 'post',
        data: { articleId,content }
    });
}

export const updateArticle = ({articleId,content}:UpsertAreticleType)=>{
    return request({
        url: `/api/articleList/${articleId}`,
        method: 'put',
        data: { articleId,content }
    });
}