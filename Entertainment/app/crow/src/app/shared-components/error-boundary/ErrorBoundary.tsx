import { Box, Button, Paper, Stack, Typography } from "@mui/material"
import { Component, ErrorInfo, ReactNode } from "react"
import { TFunction, withTranslation } from "react-i18next"
import i18n from "i18next"
import en from "./i18n/en"
import fa from "./i18n/fa"
import { ErrorOutline } from "@mui/icons-material"

interface Props {
  children?: ReactNode
  t: TFunction<"error_boundary", undefined>
  
  onResetError?(): void
}

interface State {
  hasError: boolean
  errorInfo?: {}
  errorMessage?: string
}

i18n.addResourceBundle("en", "error_boundary", en)
i18n.addResourceBundle("fa", "error_boundary", fa)

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }
  
  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.message }
  }
  
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    //send error information to  error log server
    console.log("error info:", errorInfo)
    console.log("error", error)
    this.setState({ errorInfo })
  }
  
  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (!nextState.hasError && this.state.hasError)
      this.props?.onResetError?.()
  }
  
  resetState = () => {
    console.clear()
    this.setState({
      hasError: false,
      errorInfo: {}
    })
  }
  
  reloadPage = () => {
    window.location.reload()
  }

  
  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          borderRadius: 1
        }}>
          <Paper sx={{
            position: "relative",
            width: "40%",
            height: "30%",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 2,
            overflow: "hidden"
          }} elevation={10}>
            <Box sx={{ backgroundColor: "error.light", display: "flex", width: "100%", alignItems: "center", px: 2 }}>
              <ErrorOutline fontSize="inherit" color="inherit" sx={{ color: "background.paper", fontSize: "2em" }} />
              <Typography color="background.paper" fontFamily="iranSans" variant="h6" fontSize={16} textAlign={"center"}
                          p={2} fontWeight={500}>
                {this.props.t("ERROR_BOUNDARY_MESSAGE")}
              </Typography>
            </Box>
            <Typography variant="h4" textAlign={"center"} color="error">
              {this.state?.errorMessage}
            </Typography>
            <Stack direction={"row"} sx={{ mx: 1, mb: 1, justifyContent: "flex-end" }} spacing={2}>
              <Button onClick={this.resetState} variant="outlined"
                      sx={{ borderRadius: 1.5, fontFamily: "iranSans", fontSize: "1.1em" }}>
                {this.props.t("RESET")}
              </Button>
              <Button onClick={this.reloadPage} variant="contained"
                      sx={{ borderRadius: 1.5, fontFamily: "iranSans", fontSize: "1em" }}>
                {this.props.t("RELOAD")}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )
    }
    
    return this.props.children
  }
}

export default withTranslation(["error_boundary"])(ErrorBoundary)