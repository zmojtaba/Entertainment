import { useState } from "react"
import Slider from "@mui/material/Slider"
import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Tooltip from "@mui/material/Tooltip"

const marks = [
  { value: 0.7, label: "70%" },
  { value: 0.8, label: "80%" },
  { value: 0.9, label: "90%" },
  { value: 1, label: "100%" },
  { value: 1.1, label: "110%" },
  { value: 1.2, label: "120%" },
  { value: 1.3, label: "130%" }
]

function AdjustFontSize(props) {
  const { t } = useTranslation("general")
  const [anchorEl, setAnchorEl] = useState(null)
  const [fontSize, setFontSize] = useState(1)

  function changeHtmlFontSize() {
    const html = document.documentElement;
    html.style.fontSize = `${fontSize * 62.5}%`
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Tooltip title={t("FONT_SIZE")} placement="bottom">
        <IconButton
          className={clsx("w-5 h-5", props.className)}
          aria-controls="font-size-menu"
          aria-haspopup="true"
          onClick={handleClick}
          size="large"
        >
          <Icon>format_size</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        slotProps={{
          paper: {
            sx: { minWidth: 320 }
          }
        }}
        id="font-size-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <div className="py-1.5 px-3">
          <Typography className="flex items-center justify-center text-14 font-600 mb-1">
            <Icon color="action" className="mr-0.5">
              format_size
            </Icon>
            {t("FONT_SIZE")}
          </Typography>
          <Slider
            classes={{ markLabel: "text-12 font-600" }}
            value={fontSize}
            track={false}
            aria-labelledby="discrete-slider-small-steps"
            step={0.1}
            marks={marks}
            min={0.7}
            max={1.3}
            valueLabelDisplay="off"
            onChange={(ev, value) => typeof value === "number" && setFontSize(value)}
            onChangeCommitted={changeHtmlFontSize}
          />
        </div>
      </Menu>
    </div>
  )
}

export default AdjustFontSize
