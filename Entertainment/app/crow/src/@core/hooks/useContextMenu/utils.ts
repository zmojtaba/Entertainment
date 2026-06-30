import { AnchorPoint, SelectionMode } from "@core/hooks/useContextMenu/types"

export const getSelectionText = () => {
  let text: string | null = null
  let type: SelectionMode | null = null
  
  if (window.getSelection()?.type === "Caret")
    type = "CARET"
  if (window.getSelection()?.type === "Range") {
    type = "RANGE"
    text = window.getSelection()?.toString() || null
  }
  
  return {
    text,
    type
  }
}

/**
 * when context menu is shown on screen and user right click somewhere else
 * then clicked element should be the element, but event target is backdrop
 * by this function you can get the element that clicked
 * checks that in its styles don't have modal name
 * */
export const findClickedDomElement = (anchorPoint: AnchorPoint) => {
  const elements = document.elementsFromPoint(anchorPoint.x, anchorPoint.y)
  
  for (const element of elements) {
    const classes = element.classList
    let hasNoClass = true
    classes.forEach(className => {
      if (className.toLowerCase().includes("modal")) {
        hasNoClass = false
        return
      }
    })
    
    if (hasNoClass) {
      return element as HTMLElement
    }
  }
  return null
}