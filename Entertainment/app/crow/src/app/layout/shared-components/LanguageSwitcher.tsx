import Button from "@mui/material/Button"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import Popover from "@mui/material/Popover"
import Typography from "@mui/material/Typography"
import React, { useState } from "react"
import { changeLanguage, languageId, languageType } from "app/store/i18nSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import i18n from "i18next"
import _ from "lodash"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import irFlagImage from 'assets/images/flags/fa.png'
import enFlagImage from 'assets/images/flags/en.png'

export const languages: languageType[] = [
  { id: languageId.FARSI, title: "فارسی", flag: irFlagImage },
  { id: languageId.ENGLISH, title: "english", flag: enFlagImage }
]

const LanguageSwitcher = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("layout")
  const currentLanguageId = useAppSelector(({ i18n }) => i18n.language)
  const currentLanguage = _.find(languages, { id: currentLanguageId }) ?? languages[0]
  const [menu, setMenu] = useState<HTMLButtonElement | null>(null)


  const langMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMenu(event.currentTarget)
  }

  const langMenuClose = () => {
    setMenu(null)
  }

  function selectLanguage(lng: languageType) {
    dispatch(changeLanguage(lng.id))
    langMenuClose()
  }


  return (
    <>
      <Tooltip title={t("CHANGE_LANGUAGE")} placement="bottom">
        <Button className="h-5 w-8" onClick={langMenuClick} disableRipple>
          <img
            className="mx-0.5 min-w-2.5"
            src={currentLanguage.flag}
            alt={currentLanguage.title}
          />
          <Typography
            className="mx-0.5 font-600 uppercase"
            color="textSecondary"
          >
            {currentLanguage.id}
          </Typography>
        </Button>
      </Tooltip>

      <Popover
        open={Boolean(menu)}
        anchorEl={menu}
        onClose={langMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        classes={{
          paper: "py-1"
        }}
      >
        {languages.map((lng) => (
          <MenuItem
            key={lng.id}
            onClick={() => selectLanguage(lng)}
            selected={currentLanguage.id === lng.id}
          >
            <ListItemIcon className="min-w-5">
              <img
                className="w-2.5 h-2.5"
                src={lng.flag}
                alt={lng.title}
              />
            </ListItemIcon>
            <ListItemText primary={lng.title} />
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

export default LanguageSwitcher
