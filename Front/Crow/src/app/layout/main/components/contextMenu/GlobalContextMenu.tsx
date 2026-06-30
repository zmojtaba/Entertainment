import { useMemo } from "react"
import Menu from "@mui/material/Menu"
import { useAppSelector } from "app/store/hooks"
import { separateRangeAndCaretItems } from "app/features/contextMenu/selectors"
import useContextMenu from "@core/hooks/useContextMenu/useContextMenu"
import useGeneralContextMenu from "app/layout/main/components/hooks/useGeneralContextMenu"
import RecursiveMenu from "./menu/RecursiveMenu"

const GlobalContextMenu = () => {
  useGeneralContextMenu()
  const {
    anchorPoint,
    show,
    mode,
    close,
    selectedText,
    element
  } = useContextMenu()
  const contextMenu = useAppSelector(state => state.contextMenu)
  const { rangeItems, caretItems } = useMemo(() => separateRangeAndCaretItems(contextMenu, element), [contextMenu, element])


  if (!mode || !element)
    return null
  if ((mode === "CARET" && caretItems.length === 0) || (mode === "RANGE" && rangeItems.length === 0)) {
    close()
    return null
  }

  return (
    <Menu
      open={show}
      onClose={close}
      anchorReference="anchorPosition"
      anchorPosition={
        {
          top: anchorPoint.y,
          left: anchorPoint.x
        }
      }
      sx={{
        "& .MuiPaper-root": {
          border: "1px solid",
          borderColor: theme => theme.palette.primary.light,
          boxShadow: "none"
        }
      }}
    >
      <div>
        {
          mode === "CARET"
            ? caretItems.map((item, key) =>
              <RecursiveMenu
                key={`caret-nested-menu-${key}`}
                item={item}
                selectedText={selectedText}
                anchorPoint={anchorPoint}
                parentMenuOpen={show}
                close={close}
                selectedElement={element}
              />
            )
            : rangeItems.map((item, key) =>
              <RecursiveMenu
                key={`range-nested-menu-${key}`}
                item={item}
                selectedText={selectedText}
                anchorPoint={anchorPoint}
                parentMenuOpen={show}
                close={close}
                selectedElement={element}
              />
            )
        }
      </div>
    </Menu>
  )
}

export default GlobalContextMenu