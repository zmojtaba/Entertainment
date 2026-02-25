import FuseScrollbars from "@core/components/Scrollbars"
import { styled } from "@mui/material/styles"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Typography from "@mui/material/Typography"
import withReducer from "app/store/withReducer"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import reducer from "./store"
import { toggleQuickPanel } from "./store/stateSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"


const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280
  }
}))

function QuickPanel(props) {
  const dispatch = useAppDispatch()
  // const state = useAppSelector(({ quickPanel }) => quickPanel.state)

  return (
    null
    // <StyledSwipeableDrawer
    //   open={state}
    //   anchor="right"
    //   onOpen={(ev) => {
    //   }}
    //   onClose={(ev) => dispatch(toggleQuickPanel())}
    //   disableSwipeToOpen
    // >
    //   <FuseScrollbars>
    //     <Typography sx={{ pt: 2, pl: 2 }}>دسترسی سریع</Typography>
    //   </FuseScrollbars>
    // </StyledSwipeableDrawer>
  )
}

export default withReducer("quickPanel", reducer)(memo(QuickPanel))
