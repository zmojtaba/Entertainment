import { useAppDispatch, useAppSelector } from "app/store/hooks"
import IconButton from "@mui/material/IconButton"
import { openDrawer } from "app/features/exports/exportsSlice"
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove"
import Badge from "@mui/material/Badge"
import { useTranslation } from "react-i18next"
import Tooltip from "@mui/material/Tooltip"

const ExportsToggle = () => {
  const dispatch = useAppDispatch()
  
  const { t } = useTranslation("layout")
  
  const {
    exportItems
  } = useAppSelector(state => state.exports)
  
  return (
    <Tooltip title={t("EXPORTS")} placement="bottom">
    <IconButton
      className="w-5 h-5"
      onClick={() => dispatch(openDrawer())}
      size="large"
    >
      <Badge badgeContent={exportItems.length} color="primary" overlap="circular">
        <DriveFileMoveIcon />
      </Badge>
    </IconButton>
    </Tooltip>
  )
}

export default ExportsToggle