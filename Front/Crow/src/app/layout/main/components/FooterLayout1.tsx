import Toolbar from "@mui/material/Toolbar"
import { memo, useState } from "react"
import { useSelector } from "react-redux"
import { getThemeMode, selectNavbarTheme, setThemeMode } from "app/store/core/settingsSlice"
import clsx from "clsx"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import Navigation from "app/layout/shared-components/Navigation"
import UserMenu from "app/layout/shared-components/UserMenu"
import { alpha, Box, Fade, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from "react-i18next"
import { CustomMenuItem, LockTaskBarSwitch, ThemeSwitch } from "./navbar/styles"
import ChangeLanguage from "./components/Language"
import FontBox from "./components/font"
import { languageId } from "app/store/i18nSlice"
import LogoComponent from "app/pages/login/LogoComponent"

function FooterLayout1(props) {
  // const config = useAppSelector(
  //   ({ fuse }) => fuse.settings.current.layout.config
  // )
  const footerTheme = useSelector(selectNavbarTheme)
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector(getThemeMode);
  const { t } = useTranslation('navigation')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pinned, setPinned] = useState(true)
  const open = Boolean(anchorEl);
  const currentLanguageId = useAppSelector(({ i18n }) => i18n.language)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSwitch = () => {
    dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))
  };

  return (
    <Box
      id="fuse-footer"
      className={clsx("relative z-20 shadow-md p-0 ")}
      sx={{
        backgroundColor: footerTheme.palette.background.paper,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: footerTheme.palette.text.primary,
        width: 'auto',
        position: 'relative',
        height: pinned ? 'auto' : 12,
        '&  .MuiToolbar-root': {
          ...(!pinned && {
            position: pinned ? 'static' : 'absolute',
            bottom: 0,
            backdropFilter: 'blur(7px)',
            transform: 'translateY(calc(100% - 12px))',
            transition: 'transform .5s '
          }),
        },
        '&:hover': {
          '&  .MuiToolbar-root': {
            ...(!pinned && {
              transform: 'translateY(0%)',
              bottom: 0,
            }),
          }
        }
      }}
    >
      <Toolbar
        className="w-full px-1 animate-moveUpBox sm:px-1.5 overflow-x-auto rounded-se-1 rounded-ss-1"
        style={{
          backgroundColor: alpha(footerTheme.palette.info.main, .04),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflowY: 'hidden',
          maxWidth: '99%',
          boxShadow: `${footerTheme.palette.divider} 0px -1px 10px 0.5px `
          // boxShadow: `${alpha( footerTheme.palette.divider,0.05)} 0px -3px 8px 1px`
        }}>

        <div className="animate-moveUpItem3">
          <UserMenu />
        </div>

        <div className="animate-moveUpItem2" style={{ display: 'flex', flex: 1, justifyContent: 'center', overflowY: 'hidden' }}>
          <Navigation />
        </div>

        <div className="flex justify-center items-center animate-moveUpItem1 overflow-y-hidden">
          <div style={{ width: 90, height: 50 }}>
            <LogoComponent color="white" />
          </div>
          
          <IconButton onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 200,
              horizontal: currentLanguageId == languageId.FARSI ? 50 : 'right'
            }}

            sx={{
              '& .MuiPaper-root': {
                minWidth: '300px',
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent',
              }
            }}>
            <CustomMenuItem onClick={handleClose}>
              <ListItemText >
                {t('THEME')}
              </ListItemText>
              <ListItemIcon>
                <ThemeSwitch checked={themeMode === 'light'}
                  onChange={handleThemeSwitch}
                  sx={{ m: 0.1 }}
                />
              </ListItemIcon>
            </CustomMenuItem>

            <CustomMenuItem onClick={handleClose}>
              <ListItemText >
                {t('LANGUAGE')}
              </ListItemText>
              <ListItemIcon>
                <ChangeLanguage />
              </ListItemIcon>
            </CustomMenuItem>

            <MenuItem >
              <ListItemText  >
                {t('FONT')}
              </ListItemText>
              <ListItemIcon>
                <FontBox />
              </ListItemIcon>
            </MenuItem>

            <CustomMenuItem onClick={handleClose} >
              <ListItemText  >
                {t('LOCK')}
              </ListItemText>
              <ListItemIcon>
                <LockTaskBarSwitch sx={{ m: 0.1 }}
                  onClick={() => setPinned(v => !v)}
                  checked={pinned} />
              </ListItemIcon>
            </CustomMenuItem>
          </Menu>
        </div>

      </Toolbar>
    </Box>

  )
}

export default memo(FooterLayout1)
