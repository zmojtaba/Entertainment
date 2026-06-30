import { styled } from "@mui/material/styles"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import FuseScrollbars from "@core/components/Scrollbars/Scrollbars"

const navbarWidth = 220
interface navbarProps {
  folded: boolean,
  navbarOpen: boolean
}

export const StyledNavBar = styled("div")<navbarProps>
  (({ folded, navbarOpen }) => ({

    minWidth: !folded ? navbarWidth : navbarOpen ? 220 : 220,
    width: !folded ? navbarWidth : navbarOpen ? 220 : 220,
    maxWidth: !folded ? navbarWidth : navbarOpen ? 220 : 220,
    position: folded ? navbarOpen ? 'fixed' : 'static' : 'static',
    transition: 'all 0.1s ease-in-out ',
  }))

export const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
  "& .MuiDrawer-paper": {
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth
  }
}))

export const Root = styled("div")(({ theme, }) => ({
  direction:'ltr',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  width: "100%",
  "& ::-webkit-scrollbar-thumb": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.24)"
      : "rgba(255, 255, 255, 0.24)"
      }`
  },
  "& ::-webkit-scrollbar-thumb:active": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.37)"
      : "rgba(255, 255, 255, 0.37)"
      }`
  },
  "& .icon": {
    color: theme.palette.primary.dark,
  }
}))

export const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  flex: 1,
  border: '1px solid transparent',
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll"
}))

export const Logo = styled("img")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 4
}))
