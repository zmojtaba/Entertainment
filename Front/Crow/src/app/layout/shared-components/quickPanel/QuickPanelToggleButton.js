import Icon from "@mui/material/Icon"
import { useDispatch } from "react-redux"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import IconButton from "@mui/material/IconButton"
import { toggleQuickPanel } from "./store/stateSlice.ts"

function QuickPanelToggleButton(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation("layout")

  return (
    <Tooltip title={t("BOOKMARK")} placement="bottom">
      <IconButton className="w-5 h-5" onClick={(ev) => dispatch(toggleQuickPanel())} size="large">
        {props.children}
      </IconButton>
    </Tooltip>
  )
}

QuickPanelToggleButton.defaultProps = {
  children: <Icon>bookmarks</Icon>
}

export default QuickPanelToggleButton
