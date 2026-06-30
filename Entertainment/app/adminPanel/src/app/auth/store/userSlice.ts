/* eslint import/no-extraneous-dependencies: off */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import history from "@history"
import _ from "@lodash"
import {
  setDefaultSettings,
  setInitialSettings,
} from "app/store/core/settingsSlice"
import jwtService from "app/services/jwtService"
import settingsConfig from "app/app-configs/settingsConfig"

export interface profileType {
  id: number
  email: string
  uuid: string
  username: string
  password: string
  lastName: string
  firstName: string
  mobile: string
  address: string
  active: number
  avatar: string
  notes: string
  about: string
  timezone: string
  nationalCode: string
  gender: number
  createdTimestamp: number
  roles: {
    id: number
    name: string
    description: string
  }[]
  shortcuts: string[]
}

export const setUserData = (user) => async (dispatch, getState) => {
  /*
  You can redirect the logged-in user to a specific route depending on his role
  */
  if (user?.loginRedirectUrl) {
    settingsConfig.loginRedirectUrl = user.loginRedirectUrl // for example 'apps/academy'
  }

  /*
  Set User Settings
  */


  dispatch(setDefaultSettings(user.data?.settings))
  window.localStorage.setItem('user', btoa(JSON.stringify(user)))
  dispatch(setUser(user))
}


export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user
  const user = _.merge({}, oldUser, { data: { settings } })
  dispatch(updateUserData(user, "setting"))
  return dispatch(setUserData(user))
}

export const updateUserShortcuts =
  (shortcuts: string[]) => async (dispatch, getState) => {
    const { user } = getState().auth
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    }

    updateUserData(newUser, "shortcuts")?.then((res) => {
      dispatch(setUserData(newUser))
    })
  }

export const updateUserInfo =
  (info: Omit<profileType, "shortcuts" | "setting" | "roles">) =>
    async (dispatch, getState) => {
      const { user } = getState().auth
      const newUser = {
        ...user,
        data: {
          ...user.data,
          ...info,
        },
      }
      return new Promise<any>((resolve, reject) => {
        updateUserData(newUser, "info")
          ?.then(() => {
            dispatch(setUserData(newUser))
            resolve("ok")
          })
          .catch((err) => {
            reject(err.message)
          })
      })
    }

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState().auth

  console.log("GetOut", user)
  if (!user.role || user.role.length === 0) {
    // is guest
    return null
  }
  let search = new URLSearchParams(location.search)
  search.append('fallbackUrl', location.pathname)

  history.push({
    pathname: "/login",
    search: search.toString()
  })
  localStorage.removeItem('user')
  switch (user.from) {
    default: {
      jwtService.logout()
    }
  }

  dispatch(setInitialSettings())

  return dispatch(userLoggedOut())
}

export const updateUserData = (
  user: initialStateType,
  mode: "info" | "role" | "setting" | "shortcuts"
) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return
  }
  return jwtService.updateUserData(user.data, mode)
}

const initProfileValue = {}

export interface initialStateType {
  token: string
  role: string[] | string
  data: profileType
}
const initUser = window.localStorage.getItem('user') ?
  JSON.parse(atob(window.localStorage.getItem('user')!)) :
  {
    token: "",
    role: [],
    data: Object.create({}),
  };

//@ts-ignore
const initialState: initialStateType = initUser

const userSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<initialStateType>) => action.payload,
    userLoggedOut: (state) => ({
      token: "",
      role: [],
      data: Object.create({}),
    }),
    updateProfileData: (state, action: PayloadAction<profileType>) => {
      state.data = action.payload
    },
  },
  extraReducers: {},
})

export const { setUser, userLoggedOut } = userSlice.actions

export default userSlice.reducer
