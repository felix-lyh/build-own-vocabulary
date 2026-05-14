import request from './index';

export const addArticles = ({ text }: { text: string }) => {
    return request({
        url: '/api/article',
        method: 'post',
        data: { text },
    });
};
export const updateArticles = ({ id, text }: { id: string, text: string }) => {
    return request({
        url: `/api/article/${id}`,
        method: 'put',
        data: { text },
    });
};
// export const getWords = ({ page=1, limit=100}:{ page?:number, limit?:number,sort?:string }) => {
//     return new Promise(async (resolve,reject)=>{
//         try {
//             const result = await apiFetch('/api/words', {
//                 method: 'get',
//                 body: { page, limit }
//             });
//             resolve(result)
//             console.log('成功新增:', result);
//         } catch (error) {
//             reject(error)
//             console.error('新增失敗:', error);
//         }
//     })
// };
