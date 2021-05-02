import axios from 'axios'

const ajax = config => {
    const inst = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 8000
    });
    inst.interceptors.request.use(config => {
        config.headers.Authorization = sessionStorage.getItem('token');
        return config;
    })
    inst.interceptors.response.use(res => {
        
        return res.data;
    })
    return inst(config);
}

export default ajax