import React from "react"
import {
  CaretContextMenuItem,
  CaretContextMenuNested,
  RangeContextMenuItem,
  RangeContextMenuNested
} from "app/features/contextMenu/types"
import { AnchorPoint } from "@core/hooks/useContextMenu/types"
import SingleLevel from "./SingleLevel"
import MultiLevel from "./MultiLevel"

interface Props {
  item: RangeContextMenuItem | CaretContextMenuItem | RangeContextMenuNested | CaretContextMenuNested,
  selectedText: string | null,
  anchorPoint?: AnchorPoint,
  close: () => void,
  parentMenuOpen: boolean,
  selectedElement: HTMLElement
}

const RecursiveMenu = (props: Props) => {
  const {
    item,
    selectedText,
    anchorPoint,
    close,
    parentMenuOpen,
    selectedElement
  } = props;
  
  const shouldRender = item.renderFor ? item.renderFor.includes(selectedElement!.localName) : true

  if (!shouldRender) return null

  return (
    <div>
      {item.isNested
        ?
        <MultiLevel
          item={item}
          selectedText={selectedText}
          anchorPoint={anchorPoint}
          parentMenuOpen={parentMenuOpen}
          close={close}
          selectedElement={selectedElement}
        />
        :
        <SingleLevel
          selectedElement={selectedElement}
          item={item}
          selectedText={selectedText}
          anchorPoint={anchorPoint}
          close={close}
        />
      }
    </div>
  )
}

export default RecursiveMenu