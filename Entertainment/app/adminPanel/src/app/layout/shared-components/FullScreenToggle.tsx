import Icon from "@mui/material/Icon"
import Tooltip from "@mui/material/Tooltip"
import clsx from "clsx"
import { useEffect, useLayoutEffect, useState } from "react"
import IconButton from "@mui/material/IconButton"
import { useTranslation } from "react-i18next"
import ai from 'assets/images/backgrounds/ai.png'

const useEnhancedEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

const HeaderFullScreenToggle = (props) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { t } = useTranslation("layout")

  useEnhancedEffect(() => {
    document.onfullscreenchange = () =>
      setIsFullScreen(document[getBrowserFullscreenElementProp()] != null)

    return () => {
      document.onfullscreenchange = null
    }
  })

  function getBrowserFullscreenElementProp() {
    if (typeof document.fullscreenElement !== "undefined") {
      return "fullscreenElement"
    }
    throw new Error("fullscreenElement is not supported by this browser")
  }

  /* View in fullscreen */
  function openFullscreen() {
    const elem = document.documentElement

    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  function toggleFullScreen() {
    if (
      document.fullscreenElement
    ) {
      closeFullscreen()
    }
    else {
      openFullscreen()
    }
  }

  return (
    <Tooltip title={t('FULL_SCREEN_TOGGLE')} placement="bottom">
      <IconButton
        onClick={toggleFullScreen}
        className={clsx("w-5 h-5", props.className)}
        size="large"
      >
        <Icon>{isFullScreen ? "fullscreen_exit" : "fullscreen"}</Icon>
      </IconButton>
    </Tooltip>
  )
}

export default HeaderFullScreenToggle
