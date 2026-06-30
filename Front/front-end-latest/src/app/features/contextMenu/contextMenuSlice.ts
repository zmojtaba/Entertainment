import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  CaretContextMenuItem,
  CaretContextMenuNested,
  ContextMenuState,
  RangeContextMenuItem,
  RangeContextMenuNested
} from "./types"

const initialState: ContextMenuState = {
  caretItems: [],
  rangeItems: [],
  globalCaretItems: [],
  globalRangeItems: [],
  ignoredCaretElements: [],
  ignoredRangeElements: []
}


const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    setGlobalCaretItems: (state, action: PayloadAction<CaretContextMenuItem[] | CaretContextMenuNested[]>) => {
      // @ts-ignore
      state.globalCaretItems = action.payload
    },
    
    setGlobalRangeItems: (state, action: PayloadAction<RangeContextMenuItem[] | RangeContextMenuNested[]>) => {
      // @ts-ignore
      state.globalRangeItems = action.payload
    },
    
    setCaretItems: (state, action: PayloadAction<CaretContextMenuItem[] | CaretContextMenuNested[]>) => {
      // @ts-ignore
      state.caretItems = action.payload
    },
    
    setRangeItems: (state, action: PayloadAction<RangeContextMenuItem[] | RangeContextMenuNested[]>) => {
      // @ts-ignore
      state.rangeItems = action.payload
    },
    
    addCaretItems: (state, action: PayloadAction<CaretContextMenuItem[] | CaretContextMenuNested[]>) => {
      // @ts-ignore
      state.caretItems = [...state.caretItems, ...action.payload]
    },
    
    addRangeItems: (state, action: PayloadAction<RangeContextMenuItem[] | RangeContextMenuNested[]>) => {
      // @ts-ignore
      state.rangeItems = [...state.rangeItems, ...action.payload]
    },
    
    deleteRangeItems: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.rangeItems = state.rangeItems.filter(item => item.uuid !== action.payload)
    },
    
    deleteAllRangeItems: (state) => {
      state.rangeItems = []
    },
    
    deleteCaretItems: (state, action: PayloadAction<string>) => {
      // @ts-ignore
      state.caretItems = state.caretItems.filter(item => item.uuid !== action.payload)
    },
    
    deleteAllCaretItems: (state) => {
      state.caretItems = []
    },
    
    addIgnoreElementCaretItems: (state, action: PayloadAction<HTMLElement[]>) => {
      // @ts-ignore
      state.ignoredCaretElements = action.payload
    },
    
    addIgnoreElementRangeItems: (state, action: PayloadAction<HTMLElement[]>) => {
      // @ts-ignore
      state.ignoredRangeElements = action.payload
    },
    
    resetContextMenu: (state) => {
      state.caretItems = []
      state.rangeItems = []
    }
  }
})


export const {
  setGlobalCaretItems,
  setGlobalRangeItems,
  addCaretItems,
  addRangeItems,
  setCaretItems,
  setRangeItems,
  deleteCaretItems,
  deleteRangeItems,
  deleteAllRangeItems,
  deleteAllCaretItems,
  addIgnoreElementCaretItems,
  addIgnoreElementRangeItems,
  resetContextMenu
} = contextMenuSlice.actions

export default contextMenuSlice.reducer
