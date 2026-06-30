import { styled } from "@mui/material"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"

export const Container = styled("div")(({ theme }) => ({
  width: "25vw",
  minWidth: "450px",
  maxWidth: "550px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper
}))

export const ContentContainer = styled("div")(({ theme }) => ({
  padding: "0.5rem 1rem",
  display: "grid",
  gap: theme.spacing(2),
  overflowY: "auto",
  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
  direction: "rtl"
}))

export const HeaderContainer = styled("div")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5)
}))

export const Title = styled("h4")(({ theme }) => ({
  fontSize: "1.4rem",
  fontWeight: "600"
}))

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    overflow: "hidden"
  }
}))

export const StyledExportItem = styled(Paper)(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  height: 200
  // width: 200,
}))

export const Details = styled(Box)(({ theme }) => ({
  textAlign: "center",
  width: "100%",
  padding: theme.spacing(1)
}))

export const ItemImage = styled(Box)(({ theme }) => ({
  flex: 1,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  border: "1px solid",
  borderRadius: theme.shape.borderRadius,
  
  "& img": {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    objectPosition: "top"
  }
}))

