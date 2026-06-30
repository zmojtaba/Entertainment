import { LoadingButton } from "@mui/lab"
import { useEffect, useState } from "react"
import { StatusButtonProps } from "./AppCompontns"

const messageShowTime = 2000

function StatusButton(props: StatusButtonProps) {
  const {
    isSuccess,
    isError,
    successMessage = "ارسال شد",
    defaultText = "ارسال",
    failureText = "انجام نشد",
    ...buttonProps
  } = props
  
  
  const [currentColor, setCurrentColor] = useState<| "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined>(buttonProps.color)
  
  const [isFocused, setIsFocused] = useState(false)
  const [text, setText] = useState(defaultText)
  const [disabled, setDisabled] = useState(false)
  
  const resetButton = () => {
    setCurrentColor(buttonProps.color)
    setText(defaultText)
    setIsFocused(false)
    setDisabled(false)
  }
  
  useEffect(() => {
    if (isFocused && isSuccess) {
      setCurrentColor("info")
      setText(successMessage)
      setTimeout(resetButton, messageShowTime)
      setIsFocused(false)
    }
    if (isFocused && isError) {
      setCurrentColor("error")
      setText(failureText)
      setTimeout(resetButton, messageShowTime)
    }
  }, [isSuccess, isError])
  
  useEffect(() => {
    if (isFocused && buttonProps.loading) {
      setDisabled(true)
    }
    else if (isFocused && (isSuccess || isError)) {
      setTimeout(() => setDisabled(false), messageShowTime)
    }
  }, [isSuccess, isError, buttonProps.loading])
  
  useEffect(() => {
    resetButton()
  }, [])
  
  return (
    <LoadingButton
      {...buttonProps}
      onFocus={() => setIsFocused(true)}
      loading={isFocused && buttonProps.loading}
      color={currentColor}
      disabled={disabled || buttonProps.disabled}
      sx={{
        ...buttonProps.sx,
        "&.MuiButtonBase-root:disabled ": {
          color: (theme) =>
            currentColor &&
            (isError || isSuccess) &&
            currentColor !== buttonProps.color
              ? theme.palette[currentColor].contrastText
              : "auto",
          background: (theme) =>
            currentColor &&
            (isError || isSuccess) &&
            currentColor !== buttonProps.color
              ? theme.palette['info'].main
              : "red",
              opacity:'0.7'
        }
      }}
    >
      {text}
    </LoadingButton>
  )
}

export default StatusButton
