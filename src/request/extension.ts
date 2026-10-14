import request from './index';
export const downloadExtension = () => {
    return request({
        url: '/api/extension/download',
        method: 'get'
    });
}