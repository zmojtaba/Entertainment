import { motion } from "framer-motion"
import JWTLoginTab from "./JWTLoginTab"
import { StyledCard } from "@core/components/AppComponents/StyledCard"
import './login-i18n'
import './login.css'
import LogoComponent from "./LogoComponent"
import backgroundVideo from 'src/assets/videos/login_video.mp4'
// import bg1 from 'src/assets/images/backgrounds/login-bg (1).webp'
import bg1 from 'src/assets/images/backgrounds/test.jpg'
import classes from './style.module.scss'
import AILogoImage from 'assets/images/logos/ai-logo.svg'
import clsx from "clsx"

const Login = () => {
  return (
    <div className="flex items-center justify-center shrink-0 relative" onContextMenu={e => { e.stopPropagation() }}>



      <img src={bg1} style={{
        filter: "blur(5px)",
        // WebkitBackdropFilter: "blur(5px)"
      }} className="h-screen w-screen object-cover relative " alt="" />

      <div className={classes.main}>
        <img src={bg1} className='h-full w-full ' alt="" />
       <p>didehB</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-[500px]  overflow-hidden z-10 absolute m-5 "
        >
          <StyledCard
            bgPosition="top"
            className="Login-leftSection flex flex-col rounded-1.5 w-full items-center 
            justify-center filter shadow-sm min-h-[450px]  bg-transparent"
            square
          >
            <div className="flex flex-col items-center justify-center w-full py-1" 
          >
              {/* <LogoComponent color="white" /> */}

              <img
                className={classes.logoIcon}
                src={AILogoImage}
                alt="logo-icon"
              />
              <JWTLoginTab />
            </div>
          </StyledCard>
        </motion.div>
      </div>
    </div >
  )
}

export default Login
