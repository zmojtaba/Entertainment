import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { setDefaultSettings } from "app/store/core/settingsSlice"
import _ from "@lodash"
import { navbarToggle, navbarToggleMobile } from "app/store/core/navbarSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"

function NavbarToggleButton(props) {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down("lg"))
  const settings = useAppSelector(({ fuse }) => fuse.settings.current)
  const { config } = settings.layout

  return (
    <IconButton
      className={props.className}
      color="inherit"
      size="small"
      onClick={(ev) => {
        if (mdDown) {
          dispatch(navbarToggleMobile())
        } else if (config.navbar.style === "style-2") {
          dispatch(
            setDefaultSettings(
              _.set({}, "layout.config.navbar.folded", !settings.layout.config.navbar.folded)
            )
          )
        } else {
          dispatch(navbarToggle())
        }
      }}
    >
      {props.children ??
        <Icon fontSize="inherit" className="text-16">
          menu_open
        </Icon>
      }
    </IconButton>
  )
}

export default NavbarToggleButton
