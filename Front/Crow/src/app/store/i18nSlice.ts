import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import i18n from "i18next"
import { setDefaultSettings } from "./core/settingsSlice"

export enum languageId {
  FARSI = "fa",
  ENGLISH = "en",
}

export interface languageType {
  id: languageId
  title: string
  flag: string
}

type initialStateType = {
  language: languageId
}

export const changeLanguage = (languageId: languageId) => (dispatch, getState) => {
  const { direction } = getState().fuse.settings.defaults
  const newLangDirection = i18n.dir(languageId)
  /* If necessary, change theme direction */
  if (newLangDirection !== direction) {
    dispatch(
      setDefaultSettings({
        ...getState().fuse.settings.current,
        direction: newLangDirection
      })
    )
  }
  /* Change Language */
  i18n.changeLanguage(languageId).then(() => {
    localStorage.setItem("languageId", languageId)
    i18n.resolvedLanguage = languageId
    dispatch(i18nSlice.actions.languageChanged(languageId))
  })
}

const storedLanguage = localStorage.getItem("languageId")
const storeLngId = storedLanguage && typeof storedLanguage !== "undefined"
  ? storedLanguage
  : languageId.FARSI

const initialState: initialStateType = {
  language: storeLngId as languageId
}
const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<languageType["id"]>) => {
      state.language = action.payload
    }
  }
})

export const selectCurrLangDir = createSelector(
  [({ i18n: i18nState }) => i18nState.language],
  (language) => {
    return i18n.dir(language)
  }
)

export default i18nSlice.reducer
