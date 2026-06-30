import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Icon from "@mui/material/Icon"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import Popover from "@mui/material/Popover"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser } from "app/auth/store/userSlice"
import { useTranslation } from "react-i18next"
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import UserManualPdfLink from 'src/assets/users-manual.pdf'

function UserMenu(props) {
  const { t } = useTranslation("general")
  const dispatch = useAppDispatch()
  const user = useAppSelector(({ auth }) => auth.user)
  const [userMenu, setUserMenu] = useState(null)

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget)
  }

  const userMenuClose = () => {
    setUserMenu(null)
  }


  return (
    user.data && <>
      <Button
        className=" min-h-5 min-w-5 px-0 md:px-2 py-0 md:py-0.75 "
        onClick={userMenuClick}
        color="inherit"
        
      >
        <div className="hidden md:flex flex-col mx-0.5 items-end ">
          {/* <Typography component="span" className="font-600 flex" color='text.primary'>
            {/* {user.data.firstName}
          </Typography> */}
          <Typography
            className="text-11 font-500 capitalize"
            color="textSecondary"
          >
            {user.role?.[0]?.toString().toLowerCase()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              t("GUEST")}
          </Typography>
        </div>

        {user.data.avatar ? (
          <Avatar className=" md:mx-0.5" alt="user photo" src={user.data.avatar} />
        ) : (
          <Avatar sx={{ textTransform: "capitalize" }} className="md:mx-0.5">{user.data?.firstName?.charAt(0)}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: -5,
          horizontal: "center"
        }}
        classes={{
          paper: "py-1"
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/login" role="button">
              <ListItemIcon className="min-w-5">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/register" role="button">
              <ListItemIcon className="min-w-5">
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem> */}
          </>
        ) : (
          <>
            {/* <MenuItem
              component={Link}
              to="/profile"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-5">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary={t("ACCOUNT")} />
            </MenuItem> */}

            {/* <MenuItem
              component={Link}
              to="/users"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-5">
                <GroupOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t("USER_MANAGEMENT")} />
            </MenuItem> */}

            <MenuItem
              onClick={() => {
                dispatch(logoutUser())
                userMenuClose()
              }}
            >
              <ListItemIcon className="min-w-5">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary={t("Exit")} />
            </MenuItem>
          </>
        )}

        {/* <MenuItem
          component={'a'}
          href={UserManualPdfLink}
          role="button"
          target="_blank"
          download={`didehban-user-manual-${new Date().toLocaleDateString()}`}
        >
          <ListItemIcon className="min-w-5">
            <MenuBookOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={t("DOWNLOAD_USER_MANUAL")} />
        </MenuItem> */}
      </Popover>
    </>
  )
}

export default UserMenu
