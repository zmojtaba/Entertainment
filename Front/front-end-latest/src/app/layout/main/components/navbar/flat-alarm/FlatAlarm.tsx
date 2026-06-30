import { darken } from "@mui/material/styles"
import { useDispatch } from "react-redux"
import NavbarStyle1Content from "./NavbarStyleContent"
import { useAppSelector } from "app/store/hooks"
import { StyledNavBar } from "./styledComponents"

const FlatAlarm = () => {

  const navbar = useAppSelector(({ fuse }) => fuse.navbar)

  return (
    <>
      <StyledNavBar
        navbarOpen={navbar.open}
        folded={navbar.foldedOpen}
        className="flex-col flex-auto left-0  top-0 overflow-hidden h-screen shrink-0 z-20 "
        sx={{
          borderRight: "2px solid",
          borderColor: theme => darken(theme.palette.background.paper, 0.08)
        }}
      >
        <NavbarStyle1Content />
      </StyledNavBar>
    
    </>
  )
}

export default FlatAlarm
