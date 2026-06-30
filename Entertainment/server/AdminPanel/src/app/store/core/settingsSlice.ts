import { createTheme, getContrastRatio } from "@mui/material/styles"
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "@lodash"
import {
  defaultSettings,
  defaultThemeOptions,
  defaultThemes,
  extendThemeWithMixins,
  getParsedQuerySettings,
  mainThemeVariations,
  mustHaveThemeOptions
} from "@core/default-settings"
import FuseSettingsConfig, { SettingConfig, ThemeItem } from "app/app-configs/settingsConfig"
import FuseThemesConfig from "app/app-configs/themesConfig"
import LayoutConfigs from "app/layout/LayoutConfigs"
import { PaletteMode } from "@mui/material"
import moment from "moment"
import { RootState } from ".."
import { LTR_FONTS, RTL_FONTS } from "app/constants"

interface IAppSettings {
  theme: {
    defaults: {
      dark: string;
      light: string;
    },
    mode: PaletteMode;
    nightLight: {
      start: string;
      end: string;
      enabled: boolean;
      mode: 'auto' | 'custom'
    }
  },
  typography: {
    fontFamily: {
      ltr: string,
      // rtl: string
    },
    fontSize: number
  }
}

const appSettingsInitValues: IAppSettings = {
  theme: {
    defaults: {
      dark: 'default_dark',
      light: 'default_light'
    },
    mode: 'light',
    nightLight: {
      start: moment().set({ hour: 18, minute: 0 }).format(), //6pm to 6am
      end: moment().set({ hour: 6, minute: 0 }).format(),
      enabled: false,
      mode: 'auto'
    }
  },
  typography: {
    fontFamily: {
      ltr: LTR_FONTS.toString(),
      // rtl: RTL_FONTS.toString()
    },
    fontSize: 1
  }
}

const getLocalStorageSettings = (): IAppSettings => {
  let localSettings = localStorage.getItem('app_settings');
  if (localSettings)
    return JSON.parse(localSettings)
  else {
    localStorage.setItem('app_settings', JSON.stringify(appSettingsInitValues));
    return appSettingsInitValues
  }
}

const updateLocalStorageSettings = (object: Partial<IAppSettings>) => {
  let localSettings = getLocalStorageSettings()
  localStorage.setItem('app_settings', JSON.stringify({
    ...localSettings,
    ...object
  }))
}

const appSettings = getLocalStorageSettings()



function getInitialSettings() {
  const defaultLayoutStyle =
    FuseSettingsConfig.layout && FuseSettingsConfig.layout.style
      ? FuseSettingsConfig.layout.style
      : "layout1"
  const layout = {
    style: defaultLayoutStyle,
    config: LayoutConfigs[defaultLayoutStyle].defaults
  }
  return _.merge(
    {},
    defaultSettings,
    { layout },
    FuseSettingsConfig,
    getParsedQuerySettings()
  )
}

export function generateSettings(
  _defaultSettings: SettingConfig,
  _newSettings: SettingConfig
) {
  const response = _.merge(
    {},
    _defaultSettings,
    {
      layout: {
        config: LayoutConfigs[_newSettings?.layout?.style]?.defaults
      }
    },
    _newSettings
  )

  /**
   * Making theme values failsafe
   */
  Object.entries(response.theme).forEach(([key, value]) => {
    if (
      value !== "mainThemeDark" &&
      value !== "mainThemeLight" &&
      !FuseThemesConfig[value]
    ) {
      response.theme[key as keyof ThemeItem] = "default"
    }
  })

  return response
}

export const getThemes = (state: RootState) => state.fuse.settings.themes
const getLang = (state: RootState) => state.i18n.language;
export const getDirection = (state) => state.fuse.settings.current.direction
const getMainThemeId = (state) => state.fuse.settings.current.theme.main
const getNavbarThemeId = (state) => state.fuse.settings.current.theme.navbar
const getToolbarThemeId = (state) => state.fuse.settings.current.theme.toolbar
const getFooterThemeId = (state) => state.fuse.settings.current.theme.footer
export const getThemeMode = (state: RootState) => state.fuse.settings.appSettings.theme.mode;
export const getDefaultThemes = (state: RootState) => state.fuse.settings.appSettings.theme.defaults;
export const getNightLightConfig = (state: RootState) => state.fuse.settings.appSettings.theme.nightLight;
export const getFonts = (state: RootState) => state.fuse.settings.appSettings.typography.fontFamily;


export const selectMainThemeId = createSelector(
  [getThemeMode, getDefaultThemes],
  (themeMode, defaults_themes) => defaults_themes[themeMode]
)

function generateMuiTheme(themes: any, id: string, direction: 'ltr' | 'rtl', fonts: IAppSettings['typography']['fontFamily']) {
  const fontFamily = fonts[direction];
  document.documentElement.style.fontFamily = fontFamily

  const data = _.merge(
    {
      typography: {
        fontFamily,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
      }
    },
    defaultThemeOptions,
    themes[id],
    mustHaveThemeOptions
  )
  const response = createTheme(
    _.merge({}, data,
      {
        mixins: extendThemeWithMixins(data),
        direction
      })
  )
  return response
}

export const selectFuseThemeById = (id) =>
  createSelector([getThemes, getDirection, getFonts], (themes, direction, fonts) =>
    generateMuiTheme(themes, id, direction, fonts)
  )

export const selectContrastMainTheme = (bgColor) => {
  function isDark(color) {
    return getContrastRatio(color, "#ffffff") >= 3
  }
  return isDark(bgColor) ? selectMainThemeDark : selectMainThemeLight
}

export const selectMainTheme = createSelector(
  [getThemes, selectMainThemeId, getDirection, getFonts], generateMuiTheme)

export const selectMainThemeDark = createSelector(
  [getThemes, getDirection, getFonts],
  (themes, direction, fonts) => generateMuiTheme(themes, "mainThemeDark", direction, fonts)
)
export const selectMainThemeLight = createSelector(
  [getThemes, getDirection, getFonts],
  (themes, direction, fonts) => generateMuiTheme(themes, "mainThemeLight", direction, fonts)
)

export const selectNavbarTheme = createSelector(
  [getThemes, selectMainThemeId, getDirection, getFonts], generateMuiTheme)

export const selectToolbarTheme = createSelector(
  [getThemes, selectMainThemeId, getDirection, getFonts], generateMuiTheme)

export const selectFooterTheme = createSelector(
  [getThemes, getFooterThemeId, getDirection, getFonts], generateMuiTheme)


const themesObjRaw = Object.keys(FuseThemesConfig).length !== 0 ? FuseThemesConfig : defaultThemes
const initialSettings = getInitialSettings()
const initialThemes = {
  ...themesObjRaw,
  ...mainThemeVariations(themesObjRaw[initialSettings.theme.main])
}


const initialState = {
  initial: initialSettings,
  defaults: _.merge({}, initialSettings),
  current: _.merge({}, initialSettings),
  themes: initialThemes,
  appSettings,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const current = generateSettings(state.defaults, action.payload)
      const themes =
        current.theme.main !== state.current.theme.main
          ? {
            ...state.themes,
            ...mainThemeVariations(themesObjRaw[current.theme.main])
          }
          : state.themes
      return {
        ...state,
        current,
        themes
      }
    },
    setDefaultSettings: (state, action) => {
      const defaults = generateSettings(state.defaults, action.payload)
      const themes = defaults.theme.main !== state.defaults.theme.main ?
        {
          ...state.themes,
          ...mainThemeVariations(themesObjRaw[defaults.theme.main])
        }
        : state.themes
      return {
        ...state,
        defaults: _.merge({}, defaults),
        current: _.merge({}, defaults),
        themes
      }
    },
    setInitialSettings: (state) => {
      return _.merge({}, initialState)
    },
    resetSettings: (state) => {
      const themes = {
        ...state.themes,
        ...mainThemeVariations(themesObjRaw[state.defaults.theme.main])
      }
      return {
        ...state,
        defaults: _.merge({}, state.defaults),
        current: _.merge({}, state.defaults),
        themes
      }
    },

    setTheme: (state, action: PayloadAction<{ mode: PaletteMode, themeName: string }>) => {
      const { mode, themeName } = action.payload;
      //  state.appSettings.theme.mode = mode;
      state.appSettings.theme.defaults[mode] = themeName;
      updateLocalStorageSettings(state.appSettings)
    },

    setThemeMode(state, action: PayloadAction<PaletteMode>) {
      //  state.appSettings.theme.nightLight.enabled = false;
      state.appSettings.theme.mode = action.payload;
      updateLocalStorageSettings(state.appSettings)
    },

    setNightLight: (state, action: PayloadAction<IAppSettings['theme']['nightLight']>) => {
      state.appSettings.theme.nightLight = action.payload;
      updateLocalStorageSettings(state.appSettings)
    },

    setFontSettings: (state, action: PayloadAction<Partial<IAppSettings['typography']>>) => {
      state.appSettings.typography = {
        ...state.appSettings.typography,
        ...action.payload
      };
      updateLocalStorageSettings(state.appSettings)
    },
  }
})

export const {
  resetSettings,
  setDefaultSettings,
  setInitialSettings,
  setSettings,
  setTheme,
  setThemeMode,
  setNightLight,
  setFontSettings
} = settingsSlice.actions

export default settingsSlice.reducer
