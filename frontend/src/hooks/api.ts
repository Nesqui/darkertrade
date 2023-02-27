import type { AxiosInstance } from 'axios'
import axios from 'axios'

let axiosClient: AxiosInstance

export function initApi() {
    axiosClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    })

    axiosClient.interceptors.request.use(
        (request) => {
            //   const userStore = useUserStore()
            //   const token = computed(() => userStore.token)
            //   request.headers = { ...request.headers, Authorization: `Bearer ${token.value}` }
            //   debug('Request', request.url, request.data, request.params)
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
            console.log(response);
            
            //   if (response.status === 401 || response.data.message === 'TokenExpiredError') {
            //     emitter.emit('authorize')
            //   }

            debug('Error', response.data)
        },
    )
}

export function useApi() {
    if (!axiosClient) {
        throw new Error('axiosClient is not initialized, please use `initApi` first')
    }
    return { axiosClient }
}

function debug(...args) {
    import.meta.env.DEV && console.log('[API]', args)
}
