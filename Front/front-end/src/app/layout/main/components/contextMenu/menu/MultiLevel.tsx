import React, { useState } from "react"
import { AnchorPoint } from "@core/hooks/useContextMenu/types"
import { CaretContextMenuNested, RangeContextMenuNested } from "app/features/contextMenu/types"
import Menu from "@mui/material/Menu"
import RecursiveMenu from "./RecursiveMenu"
import { useAppSelector } from "app/store/hooks"
import { languageId } from "app/store/i18nSlice"
import SingleLevel from "./SingleLevel"


interface Props {
  item: RangeContextMenuNested | CaretContextMenuNested,
  selectedText: string | null,
  close: () => void,
  parentMenuOpen: boolean,
  anchorPoint?: AnchorPoint,
  selectedElement: HTMLElement
}


const MultiLevel = (props: Props) => {
  const {
    item,
    parentMenuOpen,
    anchorPoint,
    selectedText,
    close,
    selectedElement
  } = props

  const lang = useAppSelector(({ i18n }) => i18n.language)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [subMenuOpen, setSubMenuOpen] = useState(false)


  return (
    <div
      onMouseEnter={e => {
        e.stopPropagation()
        setSubMenuOpen(true)
        setAnchorEl(e.currentTarget)
      }}
      onMouseLeave={e => {
        e.stopPropagation()
        setSubMenuOpen(false)
        setAnchorEl(null)
      }}
      onClick={e => {
        e.stopPropagation()
        setSubMenuOpen(prevState => !prevState)
        setAnchorEl(e.currentTarget)
      }}
    >

      <SingleLevel
        item={item as any}
        selectedText={selectedText}
        close={close}
        setAnchorEl={setAnchorEl}
      />

      <Menu
        style={{ pointerEvents: "none" }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: lang === languageId.FARSI ? "left" : "right"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: lang === languageId.FARSI ? "right" : "left"
        }}
        open={subMenuOpen && parentMenuOpen}
        onClose={() => {
          setSubMenuOpen(false)
        }}
        sx={{
          "& .MuiPaper-root": {
            border: "1px solid",
            borderColor: theme => theme.palette.primary.light,
            boxShadow: "none"
          }
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {item.children.map((child, key) => {
            return <RecursiveMenu
              key={`nested-menu-${key}`}
              item={child}
              selectedText={selectedText}
              close={close} parentMenuOpen={parentMenuOpen}
              anchorPoint={anchorPoint}
              selectedElement={selectedElement}
            />
          })}
        </div>
      </Menu>
    </div>
  )
}


export default MultiLevel