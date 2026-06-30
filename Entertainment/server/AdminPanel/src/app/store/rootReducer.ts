import { CombinedState, combineReducers, Reducer } from "@reduxjs/toolkit"
import auth from "app/auth/store"
import _ from "lodash"
import fuse from "./core"
import i18n from "./i18nSlice"
import pageDetails from "./page"
import workspace from "./workspace/workspaceSlice"
import snapShot from "app/store/snapShot"
import contextMenu from "app/features/contextMenu/contextMenuSlice"
import exports from "app/features/exports/exportsSlice"
import imageEnhancer from "./imageEnhancer"

const createReducer =
  (asyncReducers?: Reducer<CombinedState<any>>) =>
    (state: any, action: any) => {
      const reducersObj = _.merge(
        {},
        {
          auth,
          fuse,
          i18n,
          pageDetails,
          workspace,
          exports,
          snapShot,
          contextMenu,
          imageEnhancer
        },
        asyncReducers
      )
      
      const combinedReducer = combineReducers(reducersObj)
      
      /*
    Reset the redux store when user logged out
     */
      if (action.type === "auth/user/userLoggedOut") {
        state = undefined
      }
      
      // return combinedReducer
      return combinedReducer(state, action)
    }

export type RootState = ReturnType<typeof createReducer>

export default createReducer
