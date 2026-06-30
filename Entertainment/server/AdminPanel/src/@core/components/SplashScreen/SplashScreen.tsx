import { memo } from "react"
import styled from "@mui/material/styles/styled"
import LinearProgress from "@mui/material/LinearProgress"


const SplashScreenContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 99999,
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  rowGap: 50
}))

function SplashScreen() {
  return (
    <SplashScreenContainer>
      <div className="logo">
        <img width="128" src="assets/images/logos/ai-logo.svg" alt="afagh-ai-logo" />
      </div>
      <div style={{ width: 150 }}>
        <LinearProgress sx={{ borderRadius: "20px" }} />
      </div>
    </SplashScreenContainer>
  )
}

export default memo(SplashScreen)
