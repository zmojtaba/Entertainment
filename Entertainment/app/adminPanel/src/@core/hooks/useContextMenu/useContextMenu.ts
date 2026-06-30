import { useCallback, useEffect, useState } from "react"
import { AnchorPoint, SelectionMode, UseContextMenuReturnType } from "./types"
import { findClickedDomElement, getSelectionText } from "@core/hooks/useContextMenu/utils"

const useContextMenu = (): UseContextMenuReturnType => {

  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>({ x: 0, y: 0 })
  const [show, setShow] = useState<boolean>(false)
  const [mode, setMode] = useState<SelectionMode | null>(null)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()
    const anchorPoint: AnchorPoint = { x: event.pageX, y: event.pageY }
    let element: HTMLElement | null

    // if show is true, so context menu is showing on screen
    // so user right-clicked in spaces around backdrop,
    // and you should get element behind backdrop
    if (show)
      element = findClickedDomElement(anchorPoint)
    else
      element = event.target as HTMLElement

    setElement(element)
    setAnchorPoint(anchorPoint)
    setShow(true)

    const { text, type } = getSelectionText()
    if (type === "RANGE") {
      setMode("RANGE")
      setSelectedText(text)
    }
    else
      setMode("CARET")

  }, [show, setShow, setAnchorPoint])


  const close = useCallback(() => {
    if (show)
      setShow(false)
  }, [show])

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu)

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [handleContextMenu])

  return {
    anchorPoint,
    show,
    mode,
    close,
    selectedText,
    element
  }
}

export default useContextMenu