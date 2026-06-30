import { ThemeProvider } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Hidden from "@mui/material/Hidden"
import Toolbar from "@mui/material/Toolbar"
import NavbarToggleButton from "app/layout/shared-components/NavbarToggleButton"
import UserMenu from "app/layout/shared-components/UserMenu"
import clsx from "clsx"
import { memo, useEffect, useState } from "react"
import { selectToolbarTheme } from "app/store/core/settingsSlice"
import { useAppSelector } from "app/store/hooks"
import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

const ToolbarLayout = () => {

  const config = useAppSelector(({ fuse }) => fuse.settings.current.layout.config)
  const lang = useAppSelector(state => state.i18n.language)
  const navbar = useAppSelector(({ fuse }) => fuse.navbar)
  const toolbarTheme = useAppSelector(selectToolbarTheme);
  const [pinned, setPinned] = useState(true)
  const pageTitle = useAppSelector(store => store.pageDetails.title);
  const { t } = useTranslation("navigation")
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);


  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        className={clsx("flex z-20 justify-between ")}
        color="transparent"
        sx={{
          transition: 'height .3s ease-in-out',
          position: pinned ? 'static' : 'absolute',
          height: pinned ? 'auto' : 12,
          overflow: 'visible',
          '& .MuiToolbar-root': {
            ...(!pinned && { transform: 'translateY(-100%)' })
          },
          '&:hover': {
            '& .MuiToolbar-root': {
              transform: 'translateY(0%)',
            }
          }
        }}
        elevation={0}
      >
        <Toolbar className="p-0 min-h-6 md:min-h-8 shadow-md flex flex-1 justify-end "
          sx={{
            transition: 'transform .3s ease-in-out',
            backgroundColor: 'background.paper'
          }}
        >
          <div className="flex py-1  px-2 items-center hidden">
            {config.navbar.display && config.navbar.position === "left" && (
              <>
                <Hidden lgDown>
                  {(config.navbar.style === "style-3" ||
                    config.navbar.style === "style-3-dense") && (
                      <NavbarToggleButton className="w-5 h-5 p-0 mx-0" />
                    )}

                  {config.navbar.style === "main" && !navbar.open && (
                    <NavbarToggleButton className="w-5 h-5 p-0 mx-0" />
                  )}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="w-5 h-5 p-0 mx-0 sm:mx-1" />
                </Hidden>
              </>
            )}

            <Hidden lgDown>
              <Typography fontSize="1.8rem" fontWeight={500} color='text.secondary'>
              </Typography>
            </Hidden>
          </div>

          <div className="flex flex-1 justify-between h-full  ltr">
            {/* <div className="flex items-center px-1 h-full overflow-x-auto"> */}
            <span className='flex  flex-col gap-1 justify-center items-center   text-[12px]
              px-2 font-serif direction:ltr' >
              <span className=' font-500'>
                {now.toLocaleTimeString()}
              </span>
              {now.toLocaleDateString()}
            </span>
            <UserMenu />
            {/* </div> */}
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider >
  )
}

export default memo(ToolbarLayout)
