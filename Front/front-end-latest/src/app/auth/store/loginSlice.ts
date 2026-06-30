import { createSlice } from "@reduxjs/toolkit"
import jwtService from "app/services/jwtService"
import { setUserData } from "./userSlice"


export const submitLogin = ({ username, password }) => async (dispatch) => {
  dispatch(loginPending())
  return jwtService
    .signInWithEmailAndPassword(username, password)
    .then((user) => {
      dispatch(loginSuccess())
      dispatch(setUserData(user))
      return user
    })
    .catch(error => {
      console.log("USer")
      dispatch(loginError(error));
      return Promise.reject(error)
    })
}

export interface LoginError {
  name: string
  description: string
  status: number
}

interface LoginState {
  loading: boolean
  success: boolean
  error: null | LoginError
}

const initialState: LoginState = {
  loading: false,
  success: false,
  error: null
}

const loginSlice = createSlice({
  name: "auth/login",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.success = false
      state.loading = true
      state.error = null
    },
    loginSuccess: (state) => {
      state.success = true
      state.loading = false
      state.error = null
    },
    loginError: (state, action) => {
      state.success = false
      state.error = action.payload
      state.loading = false
    }
  },
  extraReducers: {}
})

export const { loginSuccess, loginError, loginPending } = loginSlice.actions

export default loginSlice.reducer
