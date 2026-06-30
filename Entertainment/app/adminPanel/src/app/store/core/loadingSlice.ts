import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false
}

const dialogSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { setLoading } = dialogSlice.actions

export default dialogSlice.reducer
