import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './client'

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient(config).then(({ data }) => data)
}

export default customInstance
