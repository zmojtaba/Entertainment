import { useCallback, useEffect } from "react"
import { UseKeyProps } from "./types"

const useKeyPress = (props: UseKeyProps): void => {
  
  const {
    keyCodes,
    callback
  } = props
  
  const handler = useCallback((event: KeyboardEvent) => {
    const { code, location } = event // code is like: 'Escape', 'Enter', ...
    const includes = keyCodes.some(key => {
      if (typeof key === "object" && key.code) {
        return key.code === code && key.location === location
      }
      else if (typeof key === "string") {
        return key === code
      }
    })
    if (includes) {
      callback()
    }
  }, [callback, keyCodes])
  
  // change call listener when callback changed
  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [handler])
  
  // remove listener when unmounted
  useEffect(() => {
    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [])
}

export default useKeyPress