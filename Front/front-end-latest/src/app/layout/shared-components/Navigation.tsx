import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { memo } from "react"
import { selectNavigation } from "app/store/core/navigationSlice"
import { navbarCloseMobile } from "app/store/core/navbarSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import AppNavigation from "@core/components/AppNavigation/AppNavigation"

const Navigation = () => {
  const navigations = useAppSelector(selectNavigation)
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down("lg"))
  const dispatch = useAppDispatch()
  
  const handleItemClick = () => {
    if (mdDown) {
      dispatch(navbarCloseMobile())
    }
  }

  return (
    <AppNavigation
      navigation={navigations}
      onItemClick={handleItemClick}
    />
  )
}

export default memo(Navigation)
