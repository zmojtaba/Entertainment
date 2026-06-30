import React, { useContext, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { UnitContext } from "./TimeLine"
import { UnitType } from "./Types"


// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  min-width: 10rem;

  &:hover {
    background: #aaaaaa;
  }
`


const PlayPause = () => {
  
  const {
    endUnit,
    moveBox
  } = useContext(UnitContext) as UnitType
  
  const [isPaused, setIsPaused] = useState<boolean>(true)
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (!isPaused) {
      interval = setInterval(() => {
        moveBox(10)
      }, 80)
    }
    
    return () => {
      clearInterval(interval)
    }
  }, [isPaused, endUnit])
  
  const handlePlayClick = () => {
    setIsPaused(prevState => !prevState)
  }
  
  return (
    <Container>
      <Button onClick={handlePlayClick}>
        {
          isPaused ? "Play" : "Pause"
        }
      </Button>
    </Container>
  )
}

export default PlayPause