import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit"
import navigationConfig from "app/app-configs/navigationConfig"
import AppUtils from "@core/utils"
import i18next from "i18next"
import _ from "@lodash"
import { NavigationItem } from "../../app-configs/types"

const navigationAdapter = createEntityAdapter()
const emptyInitialState = navigationAdapter.getInitialState()
const initialState = navigationAdapter.upsertMany(
  emptyInitialState,
  navigationConfig
)

export const appendNavigationItem =
  (item, parentId) => (dispatch, getState) => {
    const navigation = selectNavigationAll(getState())
    
    return dispatch(
      setNavigation(AppUtils.appendNavItem(navigation, item, parentId))
    )
  }

export const prependNavigationItem =
  (item, parentId) => (dispatch, getState) => {
    const navigation = selectNavigationAll(getState())
    
    return dispatch(
      setNavigation(AppUtils.prependNavItem(navigation, item, parentId))
    )
  }

export const updateNavigationItem = (id, item) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState())
  
  return dispatch(setNavigation(AppUtils.updateNavItem(navigation, id, item)))
}

export const removeNavigationItem = (id) => (dispatch, getState) => {
  const navigation = selectNavigationAll(getState())
  
  return dispatch(setNavigation(AppUtils.removeNavItem(navigation, id)))
}

export const {
  selectAll: selectNavigationAll,
  selectIds: selectNavigationIds,
  selectById: selectNavigationItemById
} = navigationAdapter.getSelectors<any>((state) => state.fuse.navigation)

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigation: navigationAdapter.setAll,
    resetNavigation: (state, action) => initialState
  }
})

export const { setNavigation, resetNavigation } = navigationSlice.actions

const getUserRole = (state) => state.auth.user.role

export const selectNavigation = createSelector(
  [selectNavigationAll, ({ i18n }) => i18n.language, getUserRole],
  (navigation, language, userRole) => {
    function setTranslationValues(data) {
      // loop through every object in the array
      return data.map((item) => {
        if (item.translate && item.title) {
          item.title = i18next.t(`navigation:${item.translate}`)
        }
        
        // see if there is a children node
        if (item.children) {
          // run this function recursively on the children array
          item.children = setTranslationValues(item.children)
        }
        return item
      })
    }
    
    return setTranslationValues(
      _.merge(
        [],
        AppUtils.filterRecursive(navigation, (item) => {
          
          return AppUtils.hasPermission(item.auth, userRole)
        })
      )
    ) as NavigationItem[]
  }
)

export const selectFlatNavigation: any = createSelector(
  [selectNavigation],
  (navigation) => AppUtils.getFlatNavigation(navigation)
)

export default navigationSlice.reducer
