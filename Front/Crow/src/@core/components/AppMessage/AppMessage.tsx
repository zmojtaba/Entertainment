import { amber, blue, green } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import Snackbar from "@mui/material/Snackbar"
import SnackbarContent from "@mui/material/SnackbarContent"
import Typography from "@mui/material/Typography"
import { memo } from "react"
import { hideMessage } from "app/store/core/messageSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"

const StyledSnackbar = styled(Snackbar)<any>(({ theme, variant }) => ({
  "& .FuseMessage-content": {
    ...(variant === "success" && {
      backgroundColor: green[600],
      color: "#FFFFFF"
    }),
    
    ...(variant === "error" && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark)
    }),
    
    ...(variant === "info" && {
      backgroundColor: blue[600],
      color: "#FFFFFF"
    }),
    
    ...(variant === "warning" && {
      backgroundColor: amber[600],
      color: "#FFFFFF"
    })
  }
}))

const variantIcon = {
  success: "check_circle",
  warning: "warning",
  error: "error_outline",
  info: "info"
}

const AppMessage = () => {
  const dispatch = useAppDispatch()
  
  const state = useAppSelector(({ fuse }) => fuse.message.state)
  const options = useAppSelector(({ fuse }) => fuse.message.options)
  
  return (
    <StyledSnackbar
      {...options}
      open={!!state}
      onClose={() => dispatch(hideMessage())}
      ContentProps={{
        variant: "body2",
        headlineMapping: {
          body1: "div",
          body2: "div"
        }
      }}
    >
      <SnackbarContent
        className="FuseMessage-content"
        message={
          <div className="flex items-center">
            {variantIcon[
              options.variant ? options.variant : "check_circle"
              ] && (
              <Icon color="inherit">
                {
                  variantIcon[
                    options.variant ? options.variant : "check_circle"
                    ]
                }
              </Icon>
            )}
            <Typography className="mx-1">{options.message}</Typography>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(hideMessage())}
            size="large"
          >
            <Icon>close</Icon>
          </IconButton>
        ]}
      />
    </StyledSnackbar>
  )
}

export default memo(AppMessage)
