// import FuseSplashScreen from "@core/components/SplashScreen"
import jwtService from "app/services/jwtService"
import { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "@reduxjs/toolkit"
import { hideMessage, showMessage } from "app/store/core/messageSlice"

import { setUserData, logoutUser } from "./store/userSlice"

class Auth extends Component {
  state: any = {
    waitAuthCheck: true,
  }

  props: any

  componentDidMount() {
    Promise.all([
      this.jwtCheck(),
      // Comment the lines which you do not use
      // this.auth0Check(),
      // changed due to resolve bug
    ]).then(() => {
      this.setState({ waitAuthCheck: false })
    })
  }

  jwtCheck = () => {
    return new Promise<void>((resolve) => {
      // jwtService.on("onAutoLogin", () => {
      //   // this.props.showMessage({ message: "Logging in with JWT" })

      //   /**
      //    * Sign in and retrieve user data from Api
      //    */
      //   jwtService
      //     .signInWithToken()
      //     .then((user) => {
      //       this.props.setUserData(user)
      //       resolve()

      //       // this.props.showMessage({ message: "Logged in with JWT" })
      //     })
      //     .catch((error) => {
      //       this.props.showMessage({ message: error.message })
      //       resolve()
      //     })
      // })

      jwtService.on("onAutoLogout", (message) => {
        if (message)
          this.props.showMessage({ message })
        this.props.logout()
        resolve()
      })

      jwtService.on("onNoAccessToken", () => {
        this.props.logout()
      })
      jwtService.init()
      return resolve()
    })
  }

  render() {
    return !this.state.waitAuthCheck && (
      <>{this.props.children}</>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,
      showMessage,
      hideMessage,
    },
    dispatch
  )
}

export default connect<any, any, any>(null, mapDispatchToProps)(Auth)
