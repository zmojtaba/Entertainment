import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { IconButton, PaletteMode, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { useLocalStorage } from "usehooks-ts"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import { getThemeMode, setThemeMode } from "app/store/core/settingsSlice"
import { CSSProperties } from "react"

const DarkModeToggleButton = () => {
  const setting = useAppSelector((state) => state.fuse.settings.current)
  const { t } = useTranslation("layout")
  // const [themeMode, setThemeMode] = useLocalStorage<PaletteMode>("_lastThemeMode", "light");
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(getThemeMode);

  const handleToggleTheme = () => {
    dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <Tooltip title={t("DARK_LIGHT_MODE")} placement="bottom">
      <IconButton onClick={handleToggleTheme}>
        {
          themeMode === "dark"
            ? <LightModeIcon />
            : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default DarkModeToggleButton
