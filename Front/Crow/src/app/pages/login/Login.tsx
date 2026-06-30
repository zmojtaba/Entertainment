import { motion } from "framer-motion"
import JWTLoginTab from "./JWTLoginTab"
import './login-i18n'
import './login.css'
// import bg1 from 'src/assets/images/backgrounds/aiImage.png'
import bg1 from 'src/assets/images/backgrounds/2151022222.jpg'
import classes from './style.module.scss'
import AILogoImage from 'assets/images/logos/ai-logo.svg'
import { Divider } from "@mui/material"

const Login = () => {
  return (
    <div
      className={classes.container}
      // "flex items-center justify-center h-screen   shrink-0 relative"
      onContextMenu={e => { e.stopPropagation() }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={classes.loginContainer}>

        <div className={classes.rightContainer}>
          <div className={classes.logo}>
            <img
              width={130}
              src={AILogoImage}
              alt="logo-icon"
            />
            <div className={classes.textLogo}>
              {'Management'.split('').map((c, index) => (
                <span key={index} className={classes.charItem}
                  style={{
                    animationDelay: index * 400 + 'ms'
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className={classes.upSide}>
            <JWTLoginTab />
          </div>
          <div className={classes.downSide}>
            <span>Trial version</span>
          </div>
        </div>
     
      </motion.div >

      <img src={bg1}
        // className="h-screen w-screen object-cover relative "
        className={classes.bgImage}
        alt="" />
    </div >
  )
}

export default Login
