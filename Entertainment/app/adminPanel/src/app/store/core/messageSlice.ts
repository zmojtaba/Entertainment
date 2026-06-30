import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type variant = "success" | "error" | "warning" | "info"

interface MessageActionPayload {
  anchorOrigin?: {
    vertical: "top" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  autoHideDuration?: number
  message: string
  variant?: variant
}

interface MessageState {
  state: null | boolean
  options: MessageActionPayload
}

const initialState: MessageState = {
  state: null,
  options: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center"
    },
    autoHideDuration: 6000,
    message: "Hi",
    variant: "info"
  }
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<MessageActionPayload>) => {
      state.state = true
      state.options = {
        ...initialState.options,
        ...action.payload
      }
    },
    hideMessage: (state) => {
      state.state = null
    }
  }
})

export const { hideMessage, showMessage } = messageSlice.actions

export default messageSlice.reducer
