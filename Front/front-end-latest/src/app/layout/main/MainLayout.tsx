import '../i18n'
import { memo, useContext, useEffect } from "react"
import AppDialog from "@core/components/AppDialog"
import { styled } from "@mui/material/styles"
import FuseMessage from "@core/components/AppMessage"
import AppSuspense from "@core/components/AppSuspense"
import AppContext from "app/AppContext"
import { RouteObject, useLocation, useRoutes } from "react-router-dom"
import FooterLayout1 from "./components/FooterLayout1"
import NavbarWrapperLayout1 from "./components/NavbarWrapperLayout1"
import RightSideLayout1 from "./components/RightSideLayout1"
import ToolbarLayout from "./components/ToolbarLayout"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { PAGES_DETAILS } from "app/constants"
import { updateAppPage } from "app/store/page"
import { useTranslation } from "react-i18next"
import { getThemeMode } from "app/store/core/settingsSlice"
import { useTheme } from "@mui/material"
import clsx from "clsx"
import _ from 'lodash'
import { convertPaletteToCSSVars } from 'app/services/utils'
import GlobalContextMenu from './components/contextMenu/GlobalContextMenu'
import ImageEnhancerDialog from '@core/components/ImageEnhancerDialog'

const Root = styled("div", {
  shouldForwardProp: (props) => props !== "config"
})<{ config: any }>(({ config }) => ({
  ...(config.mode === "boxed" && {
    clipPath: "inset(0)",
    maxWidth: `${config.containerWidth}px`,
    margin: "0 auto",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  }),
  ...(config.mode === "container" && {
    "& .container": {
      maxWidth: `${config.containerWidth}px`,
      width: "100%",
      margin: "0 auto"
    }
  })
}))

const MainLayout = (props) => {
  const { t } = useTranslation("navigation")
  const theme = useTheme()
  let location = useLocation()
  const dispatch = useAppDispatch()
  const config = useAppSelector(({ fuse }) => fuse?.settings.current.layout.config)
  const pageTitle = useAppSelector((state) => state.pageDetails.title)
  const themeMode = useAppSelector(getThemeMode);
  const { routes } = useContext(AppContext)
  document.title = pageTitle ? t(pageTitle) : '';
  // save theme mode in local storage
  //const [themeMode] = useLocalStorage<PaletteMode>("_lastThemeMode", "light")


  useEffect(() => {
    const foundedKey = _(PAGES_DETAILS).keys().findLast(key => window.location.href.includes(key))
    if (foundedKey)
      dispatch(updateAppPage(PAGES_DETAILS[foundedKey]))
  }, [location])

  // synchronize theme mode of all tabs
  // useEffect(() => {
  //   const darkThemeId = "dark"
  //   const lightThemeId = "light"
  //   if (themeMode === "dark") {
  //     dispatch(setTheme({
  //       main: darkThemeId,
  //       navbar: darkThemeId,
  //       toolbar: darkThemeId,
  //       footer: darkThemeId
  //     }))
  //   }
  //   else if (themeMode === "light") {
  //     dispatch(setTheme({
  //       main: lightThemeId,
  //       navbar: lightThemeId,
  //       toolbar: lightThemeId,
  //       footer: lightThemeId
  //     }))
  //   }
  // }, [themeMode])


  useEffect(() => {
    _.forEach(convertPaletteToCSSVars(theme.palette), (v, k) => {
      document.body.style.setProperty(k, String(v));
      // console.log(k, String(v))
    })
  }, [theme])


  return (
    <Root
      id="fuse-layout"
      config={config}
      sx={{ backgroundColor: 'background.default' }}
      // add theme-light or dark base on themeMode (saved in local storage)
      className={clsx("theme w-full flex", `theme-${themeMode}`,)}
    >
      {/* <Loading /> */}

      <div className="flex flex-auto min-w-0 ">
        {config.navbar.display && config.navbar.position === "right" && (
          <NavbarWrapperLayout1 />
        )}

        <main
          id="fuse-main"
          className="flex flex-col flex-1 h-screen min-w-0
           relative z-10 overflow-hidden"
        >
          {config.toolbar.display && (
            <ToolbarLayout
            // className={config.toolbar.style === "fixed" ? "sticky top-0" : ""}
            />
          )}

          <div className="flex flex-col flex-auto min-h-0 relative z-5" >
            <AppDialog />
            <ImageEnhancerDialog />
            <AppSuspense >{useRoutes(routes as RouteObject[])}</AppSuspense>
            {props.children}
          </div>

          {config.footer.display && (
            <FooterLayout1
              className={config.footer.style === "fixed" && "sticky bottom-0"}
            />
          )}
        </main>

        {config.navbar.display && config.navbar.position === "left" && (
          <NavbarWrapperLayout1 />
        )}
      </div>
      {config.rightSidePanel.display && <RightSideLayout1 />}
      <GlobalContextMenu />
      <FuseMessage />
    </Root>
  )
}

export default memo(MainLayout)