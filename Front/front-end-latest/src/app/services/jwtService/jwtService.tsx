import AppUtils from "@core/utils/AppUtils"
import axios from "axios"
import jwtDecode from "jwt-decode"
/* eslint-disable camelcase */
import type { profileType } from "app/auth/store/userSlice"
import { getLoginResource } from 'app/services/axios/axiosRequests'
import moment from 'moment';
import { authRoles } from "app/auth";
import { axiosInstances } from 'app/services/axios/instance'
import { LoginError } from "app/auth/store/loginSlice";

let interval: NodeJS.Timer;

class JwtService extends AppUtils.EventEmitter {
  init() {
    this.setInterceptors()
    this.handleAuthentication()
  }

  extendTokenTime() {
    let token = this.getAccessToken()
    if (token) {
      this.setSession(moment().unix())
    }
  }

  setInterceptors = () => {
    Object.values(axiosInstances).concat([axios]).forEach(instance => {
      instance.interceptors.request.use(
        (config) => {
          this.extendTokenTime();
          // console.log('interceptors called', config)
          return config
        },
        (error) => {
          this.extendTokenTime()
          return Promise.reject(error);
        }
      )

    })
  }

  handleAuthentication = () => {
    const access_token = this.getAccessToken()
    if (!access_token) {
      this.emit("onNoAccessToken")
      return
    }

    // console.log("access_token",this.isAuthTokenValid(access_token));

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token)
      // this.emit("onAutoLogin", true)
      this.checkIsExpired()
    } else {
      this.setSession(null)
      this.emit("onAutoLogout", "access_token expired")
    }
  }

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token)
          resolve(response.data.user)
        } else {
          reject(response.data.error)
        }
      })
    })
  }

  checkIsExpired = () => {
    if (!interval)
      interval = setInterval(() => {
        this.handleAuthentication()
      }, 2000)
  }

  getFallbackURL = () => {
    // return new URLSearchParams(location.search).get('fallbackUrl')
  }

  signInWithEmailAndPassword = (username, password) => {

    return new Promise((resolve, reject: (error: LoginError) => void) => {
      getLoginResource({
        username,
        password
      })
        .then((res) => {
          // console.log("Login Response Data", res.data)
          // if (res.data?.status === 'true') { //OK
          if (res.data) { //OK
            // let token = moment().unix();
            // let username = res.data.username
            // let role = res.data?.role
            // let accessToken = res.data.accessToken
            let username = 'test'
            let role = 'Admin'
            let accessToken = res.data.accessToken
            this.setSession(accessToken)
            resolve({
              // token: accessToken,
              // role: user.roles || authRoles.admin,
              // role: authRoles.admin,
              role: [role.toLocaleUpperCase()],
              loginRedirectUrl:'/login',
              data: {
                firstName: username,// user.firstName,
                lastName: username,// user.lastName,
                username: username,// user.username,
              },
            })
            this.checkIsExpired()
          } else {
            reject({
              name: 'UNKNOWN_ERROR',
              description: 'UNKNOWN_ERROR',
              status: 1
            })
          }
        })
        .catch((error) => {
          console.log("Login Response Data", error)


          let loginError: LoginError = {
            status: 0,
            name: 'UNKNOWN_ERROR',
            description: 'UNKNOWN_ERROR'
          }

          if (error.code === 'ERR_NETWORK') {
            loginError = {
              status: 500,
              name: error.code,
              description: error.code
            }
          } else if (error.response) {
            loginError = {
              status: error?.response?.status,
              name: error?.response?.data?.detail as string,
              description: error?.response?.data?.detail as string,
            }
          } else {
            loginError = {
              status: 500,
              name: 'UNKNOWN_ERROR',
              description: 'UNKNOWN_ERROR'
            }
          }
          reject(loginError)
        })
    })
  }

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/oauth/token/validation", {
          baseURL: '',

          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data) {
            const token = this.getAccessToken()
            const decodedToken: any = token && jwtDecode(token)
            this.setSession(token)
            resolve({
              access_token: token,
              role: decodedToken?.roles,
              loginRedirectUrl: "/",
              data: {
                firstName: decodedToken?.firstname,
                lastName: decodedToken?.lastname,
                username: decodedToken?.username,
              },
            })
          } else {
            this.logout()
            reject(new Error("Failed to login with token."))
          }
        })
        .catch((error) => {
          this.logout()
          reject(new Error("Failed to login with token."))
        })
    })
  }

  updateUserData = (
    user: profileType,
    mode?: "info" | "role" | "setting" | "shortcuts"
  ) => {
    if (mode === "info") {
      const { roles, shortcuts, ...profileInfo } = user
      return axios.put(`/api/user/info/${user.uuid}`, { ...profileInfo })
    }
    return axios.post("/api/auth/user/update", {
      user,
    })
  }

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token)
      //   axios.defaults.headers.common.Authorization = `Bearer ${access_token}`
    } else {
      localStorage.removeItem("jwt_access_token")
      //   delete axios.defaults.headers.common.Authorization
    }
  }


  logout = () => {
    this.setSession(null)
  }

  isAuthTokenValid = (access_token) => {
    const decode: any = jwtDecode(access_token)
    // console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", decode?.exp!);

    if (!access_token) {
      return false
    }

    const expMs = decode!.exp;
    const nowMs = Math.round(Date.now() / 1000);

    // console.log('expMs', expMs);
    // console.log('expMs', nowMs);
    // console.log('nowMs', expMs > nowMs);



    if (expMs < nowMs) {
      return false
    }
    return true
  }

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token")
  }
}

const instance = new JwtService()

export default instance
