import { Box, styled } from "@mui/material"

export const NavAlarmContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "125px",
  justifyContent: "flex-end",
  position: "relative"

}))

export const AnimatedCircle = styled("circle")<{}>(({ theme }) => ({
  animation: "pulse-circle 2s infinite",
  transformOrigin: "center",
  transformBox: "fill-box",
  position: "relative",
  "@keyframes pulse-circle": {
    "0%": {
      transform: "scale(0)",
      opacity: 1
    },

    "100%": {
      transform: "scale(1)",
      opacity: 0
    }
  }
}))

export const NotificationModalContainer = styled("div")(({ theme }) => ({
  width: 360,
  height: "45vh",
  minHeight: 300,
  maxHeight: 600,
  display: "flex",
  flexDirection: "column"
}))


export const ModalAnchor = styled("span")(() => ({
  position: "absolute",
  bottom: 0,
  right: -5
}))

export const ModalHeader = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
}))


export const Root = styled("div", {
  shouldForwardProp: (props) => props !== "config"
})<{ config: any }>(({ config, theme }) => ({
  backgroundColor: theme.palette.background.default,
  ...(config.mode === "boxed" &&
  {
    clipPath: "inset(0)",
    maxWidth: `${config.containerWidth}px`,
    margin: "0 auto",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  }),
  ...(config.mode === "container" &&
  {
    "& .container": {
      maxWidth: `${config.containerWidth}px`,
      width: "100%",
      margin: "0 auto"
    }
  })
}))
