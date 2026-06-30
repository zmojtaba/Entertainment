import { useCallback, useEffect, useMemo } from "react"
import { useAppDispatch } from "app/store/hooks"
import { setGlobalCaretItems, setGlobalRangeItems } from "app/features/contextMenu/contextMenuSlice"
import { CaretContextMenuItem, RangeContextMenuItem } from "app/features/contextMenu/types"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PrintIcon from "@mui/icons-material/Print"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import ReplayIcon from "@mui/icons-material/Replay"
import { showMessage } from "app/store/core/messageSlice"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AnchorPoint } from "@core/hooks/useContextMenu/types"
import { v4 as uuid } from "uuid"
import { setImageUrl } from "app/store/imageEnhancer"
import { FcApprove } from "react-icons/fc";


// global context menu logic
// both caret and range context menu items
const useGeneralContextMenu = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation("layout")

  const copy = useCallback((_: AnchorPoint, selectedText: string) => {
    navigator.clipboard.writeText(selectedText)
      .then(() => dispatch(showMessage({
        message: t("COPIED"),
        variant: "success"
      })))
  }, [t])


  const print = useCallback(() => {
    window.print()
  }, [])

  const back = useCallback(() => {
    navigate(-1)
  }, [])

  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  const openDialogImageEnhancer = useCallback(
    (_, __, selectedElement?: HTMLElement) => {
      if (selectedElement)
        dispatch(setImageUrl({ imageUrl: (selectedElement as HTMLImageElement).src }))
    }, [])

  const globalCaret: CaretContextMenuItem[] = useMemo(() => [
    {
      type: "CARET",
      label: t("BACK"),
      callback: back,
      element: "document",
      icon: <KeyboardBackspaceIcon />,
      isNested: false,
      children: null,
      uuid: uuid()
    },
    {
      type: "CARET",
      label: t("PRINT"),
      callback: print,
      element: "document",
      icon: <PrintIcon />,
      isNested: false,
      children: null,
      uuid: uuid()
    },
    {
      type: "CARET",
      label: t("RELOAD"),
      callback: reload,
      element: "document",
      icon: <ReplayIcon />,
      isNested: false,
      children: null,
      uuid: uuid()
    },
    {
      type: "CARET",
      label: t("IMAGE_ENHANCER"),
      callback: openDialogImageEnhancer,
      element: "document",
      icon: <FcApprove />,
      isNested: false,
      children: null,
      uuid: uuid(),
      renderFor: 'img'
    },
  ], [t])

  const globalRange: RangeContextMenuItem[] = useMemo(() => [
    {
      type: "RANGE",
      label: t("COPY"),
      callback: copy,
      element: "document",
      icon: <ContentCopyIcon />,
      isNested: false,
      children: null,
      uuid: uuid()
    }
  ], [t])


  useEffect(() => {
    dispatch(setGlobalCaretItems(globalCaret))
    // dispatch(setGlobalRangeItems(globalRange)) 
  }, [t])

  return null
}

export default useGeneralContextMenu