import { ThemeProvider } from "@mui/material/styles"
import { memo } from "react"
import { selectNavbarTheme } from "app/store/core/settingsSlice"
import FlatAlarm from "./navbar/flat-alarm/FlatAlarm"
import { useAppSelector } from "app/store/hooks"

const NavbarWrapperLayout = () => {
  const config = useAppSelector(
    ({ fuse }) => fuse.settings.current.layout.config
  )
  const navbarTheme = useAppSelector(selectNavbarTheme)
  
  return (
    <>
      <ThemeProvider theme={navbarTheme}>
        <>
          {config.navbar.style === "main" && <FlatAlarm />}
        </>
      </ThemeProvider>
    </>
  )
}

export default memo(NavbarWrapperLayout)
