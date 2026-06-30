import { MutableRefObject, useCallback, useEffect } from "react"


// make html div to scroll in horizontal
// scroll down goes to left
// scroll up goes to right
const useHorizontalScroll = (elRef: MutableRefObject<any>) => {
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (e.deltaY === 0)
        return
      
      const el = elRef.current
      e.preventDefault()
      el.scrollTo({
        left: el.scrollLeft - e.deltaY,
        behavior: "smooth"
      })
    },
    []
  )
  
  useEffect(() => {
    if (elRef) {
      elRef.current.addEventListener("wheel", (e) => onWheel(e))
      return () => {
        if (elRef && elRef.current)
          elRef.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [])
  
  return null
}

export default useHorizontalScroll
