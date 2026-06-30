import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import axios from "axios";
import { DataRefrence, IMagazin, UploadData, UploadDataCurrently } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const hostOrigin = API_CONFIG.plateDetection
const instance = axios.create({
    baseURL: `http://localhost:5035/api/`
})

// registerAxiosInstance(instance)

export const getMovieList = () => {
    return api.get<UploadDataCurrently>('update-media/download-queue')
    // return instance.get<UploadDataCurrently>('update-media/download-queue')
}

export const uploadVideo = (magazine: IMagazin) => {
    const data = {
        userName: magazine.username,
        password: magazine.password!,
        confirmPassword: magazine.confirmPassword!,
        role: magazine.role
    }
    return api.post<IMagazin>(`account`, data)
}
export const UpdatePassword = (magazine: IMagazin) => {
    const data = {
        userName: magazine.username,
        password: magazine.password
    }
    return api.post<IMagazin>(`account/change-pass`, data)
}

export const deleteResource = (username: string) => {
    return api.delete(`account/accounts/${username}`)
}

export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`music/refrence-data`)
}

