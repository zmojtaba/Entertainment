import { styled } from "@mui/material/styles"

export const Container = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 1.5
}))

export const ShowStatusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  rowGap: theme.spacing(2),
  height: "100%",
  color: theme.palette.text.secondary
}))