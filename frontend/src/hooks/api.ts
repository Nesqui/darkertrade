import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { computed } from 'vue'
import { useUserStore } from '../store'

let axiosClient: AxiosInstance

const handleHumanError = (error: any) => {
    ElNotification.error({
        title: 'Error',
        message: error.message,
        duration: 5000,
    });
};

const isHumanError = (error: any) => {
    return (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500 &&
        error.response.data
    );
};


export function initApi() {
    axiosClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    })

    axiosClient.interceptors.request.use(
        (request) => {
            const userStore = useUserStore()
            const token = computed(() => userStore.token)
            request.headers['Authorization'] = `Bearer ${token.value}`
            debug('Request', request.url, request.data, request.params)
            return request
        })

    //   const { emitter } = useEmit()

    axiosClient.interceptors.response.use(
        (response) => {
            debug('Response', response.data)
            const { code, error } = response.data
            if (error) {
                return Promise.reject(
                    new Error(`code: ${code}, message: ${error}`),
                )
            }
            return response
        },
        async (error) => {
            const { response } = error
            if (response.status === 401 || response.data.message === 'TokenExpiredError') {
                const userStore = useUserStore()
                userStore.logout()
                ElNotification({
                    message: "Session expired. Please login again"
                })
                debug('error 401', response)
            }
            if (isHumanError(error)) {
                handleHumanError(error.response.data);
            }
            debug('Error', response.data)
            return Promise.reject(error);
        },
    )
}

export function useApi() {
    if (!axiosClient) {
        throw new Error('axiosClient is not initialized, please use `initApi` first')
    }
    return { axiosClient }
}

function debug(...args: any[]) {
    import.meta.env.DEV && console.log('[API]', args)
}
