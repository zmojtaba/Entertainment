import React from "react"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"
import { useAppSelector } from "app/store/hooks"

const Loading = () => {
  const { isLoading } = useAppSelector(({ fuse }) => fuse.loading)
  
  return (
    <Backdrop
      sx={{
        zIndex: 1301,
        color: "primary.light"
      }}
      open={isLoading}
    >
      <CircularProgress />
    </Backdrop>
  )
}

export default Loading
