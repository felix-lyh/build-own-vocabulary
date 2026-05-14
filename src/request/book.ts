import request from './index';

export const getBooks = ({limit=0,page=1}:{limit:number,page:number}) => {
    return request({
        url: '/api/book',
        method: 'get',
        data: { limit, page },
    });
};

export const addBook = ({ bookName }:{ bookName:string }) => {
    return request({
        url: '/api/book',
        method: 'post',
        data: { bookName },
    });
};

export const updateBook = ({id, text }:{ id:string,text:string }) => {
    return request({
        url: `/api/book/${id}`,
        method: 'put',
        data: { text },
    });
};
