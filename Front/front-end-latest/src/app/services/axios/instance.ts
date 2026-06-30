import axios, { AxiosInstance } from "axios"
import { API_CONFIG } from "../../app-configs/apiConfig"

export const axiosInstances: Record<string, AxiosInstance> = {
};
export const registerAxiosInstance = (axiosIns: AxiosInstance) => {
  if (axiosIns.defaults.baseURL)
    axiosInstances[axiosIns.defaults.baseURL] = axiosIns
}

export const instance = axios.create({
  baseURL: API_CONFIG.baseServerAddress + ':8000'
})
export const instanceRtsp = axios.create({
  baseURL: API_CONFIG.plateDetection
})

registerAxiosInstance(instance);
