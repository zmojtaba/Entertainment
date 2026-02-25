import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { Position, Rnd } from "react-rnd"
import { calcWidth, centToX, xToCent } from "./shared-methods"
import { UnitContext } from "./TimeLine"
import { DraggableData } from "react-draggable"
import { UnitType } from "./Types"
import { Container, ContainerFluid, DraggableBox } from "./StyledComponents"


// Types
interface Props {
  containerWidth: number
  setContainerWidth: Dispatch<SetStateAction<number>>
  timelineRef: RefObject<HTMLDivElement>
}

// Global Variable
const defaultTransition = "transform 0.25s linear 0s"

export let containerWidthGlobal: number = 0


const TimelineBox = (props: Props) => {
  
  const {
    containerWidth,
    setContainerWidth,
    timelineRef
  } = props
  
  const {
    startUnit,
    endUnit,
    setStartUnit,
    setEndUnit
  } = useContext(UnitContext) as UnitType
  
  
  // timeline container html element
  const container = useRef<HTMLDivElement>(null)
  
  // timeline container width
  // const [containerWidth, setContainerWidth] = useState<number>(0);
  
  // x position of rnd box
  // if x == 0 then rnd box's left side will stick to start date of timeline
  const [positionX, setPositionX] = useState(0)
  
  // width of rnd box
  // to show rnd box, I use (x-position and width) not (x1-position and x2-position)
  const [width, setWidth] = useState(0)
  
  const getWidth = (): number => {
    if (container) // --> type guard because initial type is null
      if (container.current)
        return container.current.clientWidth
    return 0
  }
  
  useEffect(() => {
    
    if (container)// --> type guard because initial type is null
      if (container.current) {
        container.current.addEventListener("wheel", mouseWheelHandler)
        container.current.addEventListener("mousedown", mouseDownHandler)
      }
    
  }, [])
  
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    
    if (timelineRef.current) {
      observer.observe(timelineRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [])
  
  useEffect(() => {
    
    // timeoutId for debounce mechanism
    let timeoutId: ReturnType<typeof setInterval>
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId)
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setContainerWidth(getWidth()), 150)
    }
    // set resize listener
    window.addEventListener("resize", resizeListener)
    
    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener)
    }
  }, [])
  
  useEffect(() => {
    containerWidthGlobal = containerWidth
    setPositionX(centToX(containerWidth, startUnit))
    setWidth(calcWidth(containerWidth, startUnit, endUnit))
  }, [containerWidth, startUnit, endUnit])
  
  useEffect(() => {
  
  }, [])
  
  const mouseWheelHandler = (event: WheelEvent) => {
    event.preventDefault()
    
    // dispatch timeline wheel event manually
    let wheelEvent = new WheelEvent("wheel", event)
    const eventDropChart = document.querySelector(".event-drop-chart") as HTMLElement
    eventDropChart.dispatchEvent(wheelEvent)
  }
  
  const mouseDownHandler = (event: MouseEvent) => {
    
    // an array of the objects on which listeners will be invoked
    const path = event.composedPath() as Element[]
    
    // iterate path array to check if mouse down event is on react rnd element
    // if yes --> not do anything
    // if no --> dispatch timeline mouse down event
    for (const item of path)
      if ("classList" in item)
        for (const className of item.classList)
          if (className === "react-draggable")
            return
    
    
    // dispatch timeline mouse down event manually
    let mouseDownEvent = new MouseEvent("mousedown", event)
    const eventDropChart = document.querySelector(".event-drop-chart") as HTMLElement
    eventDropChart.dispatchEvent(mouseDownEvent)
  }
  
  const resizeStopHandler = (
    _: any,
    __: any,
    node: HTMLElement,
    ___: any,
    position: Position) => {
    
    const startCent = xToCent(containerWidth, position.x)
    setStartUnit(startCent)
    
    const x2 = position.x + node.clientWidth
    const endCent = xToCent(containerWidth, x2)
    setEndUnit(endCent)
    
    node.style.transition = defaultTransition
  }
  
  const dragStopHandler = (_: any, data: DraggableData) => {
    
    const y = data.x + data.node.clientWidth
    
    if (y > containerWidth || data.x < 0)
      return
    
    const startCent = xToCent(containerWidth, data.x)
    setStartUnit(startCent)
    
    const endCent = xToCent(containerWidth, y)
    setEndUnit(endCent)
    
    data.node.style.transition = defaultTransition
  }
  
  const resizeStartHandler = (
    _: any,
    __: any,
    node: HTMLElement
  ) => {
    node.style.transition = "none"
  }
  
  const dragStartHandler = (_: any, data: DraggableData) => {
    data.node.style.transition = "none"
  }
  
  return (
    <ContainerFluid>
      <Container ref={container}>
        <Rnd
          style={{
            transition: defaultTransition
          }}
          default={{
            x: 0,
            y: 0,
            width: "auto",
            height: "auto"
          }}
          position={{
            x: positionX,
            y: 0
          }}
          size={{
            width: width,
            height: "100%"
          }}
          dragAxis={"x"}
          bounds="parent"
          enableResizing={{
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          onDragStart={dragStartHandler}
          onDragStop={dragStopHandler}
          onResizeStart={resizeStartHandler}
          onResizeStop={resizeStopHandler}
          minWidth={containerWidth / 100}
        >
          <DraggableBox />
        </Rnd>
      </Container>
    </ContainerFluid>
  )
}

export default TimelineBox