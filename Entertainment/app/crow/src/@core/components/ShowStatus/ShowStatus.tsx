import React from "react"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import Box from "@mui/material/Box"
import { ShowStatusContainer } from "./styledComponents"
import { SxProps } from "@mui/system"

type Props = {
  variant: "error" | "empty"
  message: string
  sx?: SxProps
}

const ShowStatus = (props: Props) => {
  const { variant, message, sx } = props
  
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1.5,
        ...sx
      }}
    >
      <ShowStatusContainer>
        <InfoOutlined
          sx={{ fontSize: "7em" }}
          color={variant === "empty" ? "inherit" : "error"}
        />
        
        <Box
          sx={{
            fontSize: "1.5em",
            color: variant === "empty" ? "inherit" : "error.main"
          }}
        >
          {message}
        </Box>
      </ShowStatusContainer>
    </Box>
  )
}

export default ShowStatus
