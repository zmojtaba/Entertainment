import React, { useEffect, useState } from "react"

export const useAudio: (url: string) => [boolean, React.Dispatch<React.SetStateAction<boolean>>] = (url) => {
  const [audio] = useState(new Audio(url))
  const [playing, setPlaying] = useState<boolean>(false)
  
  useEffect(() => {
      playing ? audio.play() : audio.pause()
    },
    [playing]
  )
  
  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false))
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false))
    }
  }, [])
  
  return [playing, setPlaying]
}
