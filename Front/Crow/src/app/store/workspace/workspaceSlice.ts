import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import workspaceConfig, { Workspace } from "@core/components/AppNavigation/workspace/WorkspaceConfig"

interface WorkspaceState {
  active: Workspace
}

const initialState: WorkspaceState = {
  active: workspaceConfig[0]
  
}

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkSpace: (state, action: PayloadAction<Workspace>) => {
      state.active = action.payload
    }
  }
})

export const { setActiveWorkSpace } = workspaceSlice.actions

export default workspaceSlice.reducer
