import { instanceRtsp } from "./instance"

interface LoginResponseType {
    status: 'true' | 'false',
    accessToken?: string,
    role: string,
    username: string
}


const getLoginResource = (data: { username: string, password: string }) => {
    const loginData = {
        "userName": data.username,
        "password": data.password
    }
    return instanceRtsp.post<LoginResponseType>('/api/account/log-in', loginData)
}

export {
    getLoginResource
}
