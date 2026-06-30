import { useEffect, useState } from "react"
import type { UseSelectReturnType } from "./types"
import useKeyPress from "../useKeyPress/useKeyPress"

const useSelect = <T extends string | number>() => {
  
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  
  useEffect(() => {
    if (!isSelectMode)
      if (selectedItems.length > 0)
        deselectAll()
  }, [isSelectMode])
  
  const switchToNormalMode = () => {
    if (isSelectMode)
      setIsSelectMode(false)
  }
  
  // when in select mode and press Esc key
  // switch to normal mode
  useKeyPress({
    callback: switchToNormalMode,
    keyCodes: ["Escape"]
  })
  
  const toggleMode = () => {
    setIsSelectMode(!isSelectMode)
  }
  
  const selectItem = (id: T) => {
    setSelectedItems(prevState => [...prevState, id])
  }
  
  const deselectItem = (id: T) => {
    setSelectedItems(prevState => prevState.filter(item => item !== id))
  }
  
  const setSelect = (ids: T[]) => {
    setSelectedItems(ids)
  }
  
  const deselectAll = () => {
    setSelectedItems([])
  }
  
  return {
    isSelectMode,
    selectedItems,
    toggleMode,
    selectItem,
    deselectItem,
    setSelect,
    deselectAll
  } as UseSelectReturnType<T>
  
}

export default useSelect