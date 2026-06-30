import Divider from "@mui/material/Divider"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import {
  CaretContextMenuItem,
  RangeContextMenuItem,
} from "app/features/contextMenu/types"
import { AnchorPoint } from "@core/hooks/useContextMenu/types"
import ArrowRight from "@mui/icons-material/ArrowRight"
import ArrowLeft from "@mui/icons-material/ArrowLeft"
import { useAppSelector } from "app/store/hooks"
import { languageId } from "app/store/i18nSlice"

interface Props {
  item: RangeContextMenuItem | CaretContextMenuItem
  selectedText: string | null,
  close: () => void,
  anchorPoint?: AnchorPoint,
  setAnchorEl?: (e) => void,
  selectedElement?: HTMLElement
}

const SingleLevel = (props: Props) => {
  const {
    item,
    selectedText,
    anchorPoint,
    close,
    setAnchorEl,
    selectedElement
  } = props
  const lang = useAppSelector(({ i18n }) => i18n.language);


  const handleClick = (e) => {
    if (setAnchorEl)
      setAnchorEl(e.currentTarget)
    else {
      !item.children && item.callback(anchorPoint as AnchorPoint, String(selectedText), selectedElement)
      close()
    }
  }


  return (
    <>
      {
        (item.divider === "top" || item.divider === "both") &&
        <Divider sx={{ my: 1, borderColor: theme => theme.palette.primary.light }} />
      }

      <MenuItem
        onClick={handleClick}
      >
        {
          item.icon &&
          <ListItemIcon
            sx={{
              "& svg": {
                fontSize: "1.8rem"
              }
            }}
          >
            {item.icon}
          </ListItemIcon>
        }

        <ListItemText inset={!item.icon}>
          {item.label}
        </ListItemText>

        {
          setAnchorEl && <ListItemIcon sx={{ justifyContent: "end" }}>
            {lang === languageId.FARSI ? <ArrowLeft /> : <ArrowRight />}
          </ListItemIcon>
        }
      </MenuItem>

      {
        (item.divider === "bottom" || item.divider === "both") &&
        <Divider sx={{ my: 1, borderColor: theme => theme.palette.primary.light }} />
      }
    </>
  )
}


export default SingleLevel