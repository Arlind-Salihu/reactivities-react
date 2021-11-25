import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Produkti } from "../models/produkti";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
},(error: AxiosError) =>{
    const {data, status, config} = error.response!;
    switch (status){
        case 400:
            if(typeof data === 'string'){
                toast.error(data);
            }
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                history.push('/not-found');
            }
            if(data.errors){
                const modalStateErrors = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            history.push('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Produktet = {
    list: () => requests.get<Produkti[]>('/produktet'),
    details: (id: string) => requests.get<Produkti>(`/produktet/${id}`),
    create: (produkti: Produkti) => axios.post<void>('/produktet', produkti),
    update: (produkti: Produkti) => axios.put<void>(`/produktet/${produkti.id}`, produkti),
    delete: (id: string) => axios.delete<void>(`/produktet/${id}`)
}

const agent = {
    Produktet
}

export default agent;