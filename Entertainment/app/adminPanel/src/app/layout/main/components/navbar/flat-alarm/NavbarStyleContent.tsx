import Navigation from "app/layout/shared-components/Navigation"
import { memo, useEffect, useState } from "react"
import {
  Box, Divider,
  useMediaQuery, useTheme
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { Root, StyledContent } from "./styledComponents"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import _ from "lodash"
import { navbarClose,  navbarOpen, navbarOpenFolded, navbarToggleFolded } from "app/store/core/navbarSlice"
import LogoComponent from "app/pages/login/LogoComponent"
import { getThemeMode, setThemeMode } from "app/store/core/settingsSlice"
import { logoutUser } from "app/auth/store/userSlice"


const NavbarStyleContent = () => {
  const { t } = useTranslation("navigation")
  const navbar = useAppSelector(({ fuse }) => fuse.navbar)
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  // console.log("IsMD", isMdUpg)
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector(getThemeMode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pinned, setPinned] = useState(true)
  const open = Boolean(anchorEl);
  const currentLanguageId = useAppSelector(({ i18n }) => i18n.language)

  useEffect(() => {
    if (isMdDown) {
      dispatch(navbarClose())
      dispatch(navbarOpenFolded())
    }
  }, [isMdDown])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSwitch = () => {
    dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))
  };
  const handleToggleSideBar = () => {
    dispatch(navbarToggleFolded())
    // setDefaultSettings(_.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded))
  }
  const handleMouseEnterSideBar = () => {
    if (navbar.foldedOpen)
      dispatch(navbarOpen())
    // setDefaultSettings(_.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded))
  }
  const handleMouseLeaveSideBar = () => {
    if (navbar.foldedOpen)
      dispatch(navbarClose())
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }
  console.log("Currentla", currentLanguageId)

  return (
    <Root className={"flex flex-auto flex-col  justify-between overflow-hidden h-full py-1 border-1 "}
      onMouseEnter={handleMouseEnterSideBar}
      onMouseLeave={handleMouseLeaveSideBar} >
      <Box sx={{
        display: 'flex',
        justifyContent: (navbar.open || !navbar.foldedOpen) ? 'space-between' : 'center',
        alignItems: 'center',
        px: (navbar.open || !navbar.foldedOpen) ? '15px' : '0px'
      }}>
        <Box sx={{
          display: "flex",
          px: '2px',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: "column",
          pb: 2.5,
          pt: 1
        }}>
          <div
            style={{
              width: 200,
              height: 45,
              margin: `0 5px ${navbar.open ? 40 : 20}px 5px`
            }}>
            <LogoComponent color="white" />
          </div>
        </Box>
       
      </Box>
      {
        !navbar.open &&
        <Divider variant="middle" />
      }
      <StyledContent option={{ suppressScrollX: true, wheelPropagation: false }} >
        <Navigation />
      </StyledContent>
     
    </Root >
  )
}

export default memo(NavbarStyleContent)
