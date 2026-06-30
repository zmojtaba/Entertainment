import { ThemeProvider } from "@mui/material/styles"
import { memo, useLayoutEffect } from "react"
import { selectMainTheme } from "app/store/core/settingsSlice"
import { useAppSelector } from "app/store/hooks"

const AppTheme = (props) => {
  const direction = useAppSelector(({ fuse }) => fuse.settings.defaults.direction)
  const i18n = useAppSelector(state => state.i18n)
  const mainTheme = useAppSelector(selectMainTheme)

  useLayoutEffect(() => {
    document.body.dir = direction
    document.dir = direction
    document.documentElement.lang = i18n.language
  }, [direction, i18n])

  // console.warn('AppTheme:: rendered',mainTheme);
  return <ThemeProvider theme={mainTheme}>{props.children}</ThemeProvider>
}

export default memo(AppTheme)
