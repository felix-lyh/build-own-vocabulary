import axios from 'axios';
const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';

const instance = axios.create({
    baseURL,
    timeout: 6000,
    headers: { 'Authorization': 'Bearer fixed-token' }
});
// 添加响应拦截器
instance.interceptors.response.use(function (response:any) {
    // 2xx 范围内的状态码
    return response?.data;
}, function (error:any) {
    // 超出 2xx 范围的状态码都会触发该函数。
    if(!error.status || error.code === 'ERR_NETWORK' || error?.status >= 500){
        // 处理500 以上的错误 弹窗出系统错误
        // TODO showMessage({type:'error',message:'common_error_network',needI18n:true});
    }
    return Promise.reject(error?.response?.data);
});
export default instance;
