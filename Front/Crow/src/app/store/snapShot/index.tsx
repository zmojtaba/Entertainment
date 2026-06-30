import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Omit } from "lodash"
import React from "react"

interface snapshot {
  captureDate: string,
  description: string,
  snapshot: string,
  id: number,
  formattedCaptureDate?: string;
}

export type initialStateType = {
  description: string;
  image: string;
  openModal: boolean;
  croppable?: boolean;
  id?: number;
  date?: string;
  onUpdateEnd?(snapshot: snapshot): void
  printable?: boolean;
  showMapLegend?: boolean;
  title?: React.ReactNode;
}

const initialState: initialStateType = {
  description: "",
  image: "",
  openModal: false
}

export const snapShotSlice = createSlice({
  name: "snapShot",
  initialState,
  reducers: {
    loadShotData: (state, action: PayloadAction<Omit<initialStateType, "openModal">>) => {
      return { ...action.payload, openModal: true }
    },
    closeModal: (state, action: PayloadAction<undefined>) => {
      return initialState
    }
  }
})

export const { loadShotData, closeModal } = snapShotSlice.actions

export default snapShotSlice.reducer
