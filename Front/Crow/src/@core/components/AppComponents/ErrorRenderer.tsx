import { ErrorOutline } from "@mui/icons-material"
import { Button, Typography } from "@mui/material"
import React from "react"

function ErrorRenderer({
                         message,
                         callback
                       }: {
  message: string
  callback?: () => void
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-y-12">
      <ErrorOutline
        fontSize="inherit"
        color="error"
        sx={{ fontSize: "6.25rem" }}
      />
      <Typography
        textAlign="center"
        color="text.secondary"
        fontSize="1.3em"
        fontWeight="700"
      >
        {message.toLowerCase() === "network error"
          ? "اتصال با سرور برقرار نشد!"
          : "خطای نامشخص!"}
      </Typography>
      {callback && <Button onClick={callback}>تلاش مجدد</Button>}
    </div>
  )
}

export default ErrorRenderer
