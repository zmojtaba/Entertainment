import { languageId } from "../store/i18nSlice"
import { PaletteMode } from "@mui/material"

export interface ThemeItem {
  main: string
  navbar: string
  toolbar: string
  footer: string
}

export interface SettingConfig {
  layout: {
    style: "layout1" | "layout2" | "layout3" | "mainLayout"
    config: any
  }
  customScrollbars: boolean
  direction: string
  theme: ThemeItem
  loginRedirectUrl: string
}


const storedLanguage = localStorage.getItem("languageId") || "fa"
const storeLngId =
  storedLanguage && typeof storedLanguage !== "undefined"
    ? storedLanguage
    : languageId.FARSI


// get last theme mode from local storage and load layout
// theme mode: "light" or "dark"
const _lastThemeMode: PaletteMode | null = localStorage.getItem("_lastThemeMode") as PaletteMode

const settingsConfig: SettingConfig = {
  layout: {
    style: "mainLayout", // layout1 layout2 layout3
    config: {} // checkout default layout configs at app/layout for example  app/layout/layout1/Layout1Config.js
  },
  customScrollbars: true,
  direction: storeLngId === "fa" || storeLngId === "ar" ? "rtl" : "ltr", // rtl, ltr
  theme: {
    main: _lastThemeMode,
    navbar: _lastThemeMode,
    toolbar: _lastThemeMode === "light" ? "mainThemeLight" : "mainThemeDark",
    footer: _lastThemeMode === "light" ? "mainThemeLight" : "mainThemeDark"
  },
  loginRedirectUrl: "/" // Default redirect url for the logged-in user
}

export default settingsConfig
