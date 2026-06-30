import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DialogProps } from "@mui/material/Dialog"

interface DialogState {
  open: boolean;
  options: Partial<DialogProps>;
}

const initialState: DialogState = {
  open: false,
  options: {}
}

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<Partial<DialogProps>>) => {
      state.open = true
      // @ts-ignore
      state.options = action.payload
    },
    
    closeDialog: (state) => {
      state.open = false
      state.options = {}
    }
  }
})

export const { openDialog, closeDialog } = dialogSlice.actions

export default dialogSlice.reducer
