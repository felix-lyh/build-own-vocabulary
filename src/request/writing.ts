import request from './index';
import type { AddWorkType, UpdateWorkType } from '@/type/writing'

export const getWorks = ({ limit = 0, page = 1 }: { limit: number, page: number }) => {
    return request({
        url: '/api/writing',
        method: 'get',
        params: { limit, page },
    });
};

export const addWork = ({ workName, workDesc }: AddWorkType) => {
    return request({
        url: '/api/writing',
        method: 'post',
        data: { workName, workDesc },
    });
};

export const getWork = (workId: string) => {
    return request({
        url: `/api/writing/${workId}`,
        method: 'get',
    });
};

export const updateWork = (workId: string, data: UpdateWorkType) => {
    return request({
        url: `/api/writing/${workId}`,
        method: 'put',
        data,
    });
};

export const deleteWork = (workId: string) => {
    return request({
        url: `/api/writing/${workId}`,
        method: 'delete',
    });
};

export const deleteWorkList = (workIdList: string[]) => {
    return request({
        url: '/api/writing',
        method: 'delete',
        data: { workIdList },
    });
};
