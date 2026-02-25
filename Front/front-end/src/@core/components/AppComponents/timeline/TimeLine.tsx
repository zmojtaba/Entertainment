import React, { createContext, useEffect, useState } from "react"
import TimeLineContainer from "./TimeLineContainer"
import { calcCentByDate, computeInitialRangeForTimeLineBox, dateToCent } from "./shared-methods"
import { containerWidthGlobal } from "./TimelineBox"
import { DataType, TimelineProps, UnitType } from "./Types"
import PlayPause from "./PlayPause"
import styled from "@emotion/styled"
import { IDateRange } from "../../../types"

// Context
export const UnitContext = createContext<UnitType | undefined>(undefined)
export const DataContext = createContext<DataType | null>(null)

// Initialize
let data: DataType = {
  name: "",
  data: []
}

// Styled component
const TimelineWrapper = styled.div`
  display: flex;
  padding: 0 12px;
`

const TimeLine = (props: TimelineProps) => {
  const { allData, initialRange, onUpdate, playable, activeDropId, filterOff } =
    props
  
  // chart range is array that have two values
  // first start date of chart and second end date of chart
  const [chartRange, setChartRange] = useState<IDateRange>(initialRange)
  
  // start and end cent for timeline box
  const [startUnit, setStartUnit] = useState<number>(0)
  const [endUnit, setEndUnit] = useState<number>(1)
  
  // timeline container width
  const [containerWidth, setContainerWidth] = useState<number>(0)
  
  useEffect(() => {
    data = {
      name: "",
      data: allData
    }
  }, [allData])
  
  useEffect(() => {
    const timelineBoxRange = computeInitialRangeForTimeLineBox([
      initialRange[0],
      initialRange[1]
    ])
    
    const initialStart = dateToCent(
      initialRange,
      timelineBoxRange[0],
      containerWidth
    )
    const initialEnd = dateToCent(
      initialRange,
      timelineBoxRange[1],
      containerWidth
    )
    
    setStartUnit(initialStart)
    setEndUnit(initialEnd)
  }, [containerWidth])
  
  useEffect(() => {
    setChartRange(initialRange)
  }, [initialRange])
  
  // move timeline box to right (positive) or left (negative)
  // if amount == 1 then box moves right 1 unit
  const moveBox = (amount: number) => {
    if (endUnit + amount > containerWidthGlobal) {
      setChartRange((prevChartRange) => {
        const newStart = new Date(
          prevChartRange[0].getTime() + 10 * calcCentByDate(chartRange)
        )
        const newEnd = new Date(
          prevChartRange[1].getTime() + 10 * calcCentByDate(chartRange)
        )
        
        return [newStart, newEnd]
      })
    }
    else {
      setStartUnit((prevState) => prevState + amount)
      setEndUnit((prevState) => prevState + amount)
    }
  }
  
  const unit: UnitType = {
    startUnit,
    endUnit,
    setStartUnit,
    setEndUnit,
    moveBox
  }
  
  return (
    <DataContext.Provider value={data}>
      <UnitContext.Provider value={unit}>
        <TimelineWrapper>
          <TimeLineContainer
            onUpdate={onUpdate}
            chartRange={chartRange}
            setChartRange={setChartRange}
            active={activeDropId}
            containerWidth={containerWidth}
            setContainerWidth={setContainerWidth}
            filterOff={filterOff}
          />
          
          {playable && <PlayPause />}
        </TimelineWrapper>
      </UnitContext.Provider>
    </DataContext.Provider>
  )
}

export default TimeLine
