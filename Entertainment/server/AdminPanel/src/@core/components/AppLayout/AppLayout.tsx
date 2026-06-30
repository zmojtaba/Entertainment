import { useDeepCompareEffect } from "@core/hooks"
import Layouts from "app/layout/Layouts"
import _ from "@lodash"
import AppContext from "app/AppContext"
import { generateSettings, setSettings } from "app/store/core/settingsSlice"
import { memo, useCallback, useContext, useMemo, useRef } from "react"
import { matchRoutes, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
import fa from "./i18n/fa"
import en from "./i18n/en"

i18n.addResourceBundle("fa", "routes", fa)
i18n.addResourceBundle("en", "routes", en)

function AppLayout(props) {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(({ fuse }) => fuse.settings.current)
  const defaultSettings = useAppSelector(({ fuse }) => fuse.settings.defaults)
  
  const { t } = useTranslation("routes")
  const appContext = useContext(AppContext)
  const { routes } = appContext
  
  const location = useLocation()
  const { pathname } = location
  
  const matchedRoutes = routes && matchRoutes(routes, pathname)
  const matched = matchedRoutes ? matchedRoutes[0] : false
  
  if (matched && matched.route.title) {
    document.title = `Management`
  }
  else {
    document.title = `Management`
  }
  
  const newSettings = useRef(null)
  
  const shouldAwaitRender = useCallback(() => {
    let _newSettings
    /**
     * On Path changed
     */
    // if (prevPathname !== pathname) {
    if (matched && (matched as any).route.settings) {
      /**
       * if matched route has settings
       */
      
      const routeSettings = (matched as any).route.settings
      
      _newSettings = generateSettings(defaultSettings, routeSettings)
    }
    else if (!_.isEqual(newSettings.current, defaultSettings)) {
      /**
       * Reset to default settings on the new path
       */
      _newSettings = _.merge({}, defaultSettings)
    }
    else {
      _newSettings = newSettings.current
    }
    
    if (!_.isEqual(newSettings.current, _newSettings)) {
      newSettings.current = _newSettings
    }
  }, [defaultSettings, matched])
  
  shouldAwaitRender()
  
  useDeepCompareEffect(() => {
    if (!_.isEqual(newSettings.current, settings)) {
      dispatch(setSettings(newSettings.current))
    }
  }, [dispatch, newSettings.current, settings])
  
  // console.warn('::AppLayout:: rendered');
  
  const Layout = useMemo(
    () => Layouts[settings.layout.style],
    [settings.layout.style]
  )
  
  return _.isEqual(newSettings.current, settings)
    ? <Layout {...props} />
    : null
}

export default memo(AppLayout)

