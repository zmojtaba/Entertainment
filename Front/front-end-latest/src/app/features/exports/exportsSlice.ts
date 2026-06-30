import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ExportItem, ExportsState } from "./types"
import _ from "lodash"

const initialState: ExportsState = {
  isOpen: false,
  selectMode: false,
  exportItems: [],
  selectedExportItems: []
}


const exportsSlice = createSlice({
  name: "exports",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isOpen = true
    },
    
    closeDrawer: (state) => {
      state.isOpen = false
    },
    
    addExport: (state, action: PayloadAction<ExportItem>) => {
      const exportArray = state.exportItems
      
      // id should be unique
      // so iterate export array to check all titles
      for (let item of exportArray) {
        if (item.id === action.payload.id) {
          console.error("Id in export item should be unique, this id is used before")
          return
        }
      }
      state.exportItems.push(action.payload)
    },
    
    // delete export ready item by id
    deleteExports: (state) => {
      const willDeleteExports = state.selectedExportItems
      const oldExportArray = _.cloneDeep(state.exportItems)
      
      for (let exportItem of willDeleteExports) {
        const foundIndex = oldExportArray.findIndex(item => item.id === exportItem)
        if (foundIndex > -1)
          oldExportArray.splice(foundIndex, 1)
      }
      
      state.exportItems = oldExportArray
      state.selectedExportItems = []
      state.selectMode = false
    },
    
    editExportName: (state, action: PayloadAction<{ id: string, newTitle: string }>) => {
      const {
        id,
        newTitle
      } = action.payload
      const oldExportArray = state.exportItems
      
      const foundNodeIndex = oldExportArray.findIndex(item => item.id === id)
      if (foundNodeIndex > -1)
        oldExportArray[foundNodeIndex].title = newTitle
    },
    
    selectItem: (state, action: PayloadAction<string>) => {
      const exportId = action.payload
      const oldSelectedExportArray = state.selectedExportItems
      
      const foundNodeIndex = oldSelectedExportArray.findIndex(item => item === exportId)
      // if not found in the selectedItem array, so add it
      if (foundNodeIndex === -1)
        state.selectedExportItems = [...oldSelectedExportArray, exportId]
    },
    
    deselectItem: (state, action: PayloadAction<string>) => {
      const exportId = action.payload
      const oldSelectedExportArray = state.selectedExportItems
      
      const foundNodeIndex = oldSelectedExportArray.findIndex(item => item === exportId)
      // if found in the selectedItem array, so remove it
      if (foundNodeIndex !== -1)
        oldSelectedExportArray.splice(foundNodeIndex, 1)
    },
    
    selectAllItems: (state) => {
      state.selectedExportItems = []
      state.exportItems.forEach(item => {
        state.selectedExportItems.push(item.id)
      })
    },
    
    deselectAllItems: (state) => {
      state.selectedExportItems = []
    },
    
    switchToSelectMode: (state) => {
      state.selectMode = true
    },
    
    switchToNormalMode: (state) => {
      state.selectMode = false
      state.selectedExportItems = []
    }
    
  }
})


export const {
  openDrawer,
  closeDrawer,
  addExport,
  deleteExports,
  editExportName,
  selectItem,
  deselectItem,
  selectAllItems,
  deselectAllItems,
  switchToSelectMode,
  switchToNormalMode
} = exportsSlice.actions

export default exportsSlice.reducer
