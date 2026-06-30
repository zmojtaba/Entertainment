import Dialog from "@mui/material/Dialog"
import { closeDialog } from "app/store/core/dialogSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { useTheme } from "@mui/material/styles"
import clsx from "clsx"

const AppDialog = () => {
  const dispatch = useAppDispatch()
  
  const open = useAppSelector(({ fuse }) => fuse.dialog.open)
  const options = useAppSelector(({ fuse }) => fuse.dialog.options)
  
  const { palette } = useTheme()

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeDialog())}
      aria-labelledby="fuse-dialog-title"
      className={clsx("theme", palette.mode === "light" ? "theme-light" : "theme-dark")}
      classes={{
        paper: "max-w-full"
      }}
      {...options}
    />
  )
}

export default AppDialog
