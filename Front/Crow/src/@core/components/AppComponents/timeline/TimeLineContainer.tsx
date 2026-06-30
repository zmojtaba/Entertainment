import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
// @ts-ignore
import * as d3 from "d3"
import TimelineBox from "./TimelineBox"
import { DataContext, UnitContext } from "./TimeLine"
import { centToDate } from "./shared-methods"
import styled from "@emotion/styled"

// @ts-ignore
import eventDrops from "event-drops"
import { DataType, Drop, OnUpdate, UnitType } from "./Types"
import { IDateRange } from "../../../types"

// Styled component
const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;
`

// Types
interface PropsType {
  onUpdate?: OnUpdate;
  chartRange: IDateRange;
  setChartRange: Dispatch<SetStateAction<IDateRange>>;
  active?: string;
  containerWidth: number;
  setContainerWidth: Dispatch<SetStateAction<number>>;
  filterOff?: boolean;
}

// Global variables
let chart: any = null

// timeoutId for debounce mechanism
let timeoutId: ReturnType<typeof setInterval>

const TimeLineContainer = (props: PropsType) => {
  const {
    onUpdate,
    chartRange,
    setChartRange,
    active,
    containerWidth,
    setContainerWidth,
    filterOff
  } = props
  
  const data = useContext(DataContext) as DataType
  
  const { startUnit, endUnit } = useContext(UnitContext) as UnitType
  
  const [filterRange, setFilterRange] = useState<IDateRange>(chartRange)
  
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const updateCommitsInformation = (): void => {
    const range = chart.scale().domain()
    
    // prevent execution of previous setTimeout
    clearTimeout(timeoutId)
    
    // change width from the state object after 150 milliseconds
    timeoutId = setTimeout(() => {
      setChartRange(range)
    }, 150)
  }
  
  const initializeChart = () => {
    return eventDrops({
      d3,
      zoom: {
        onZoom: () => updateCommitsInformation()
      },
      label: {
        text: "",
        padding: 0
      },
      range: {
        start: chartRange[0],
        end: chartRange[1]
      },
      margin: {
        top: 20,
        right: 10,
        bottom: 0,
        left: -190
      },
      drop: {
        date: (drop: Drop) => {
          if ("time" in drop) if (drop.time) return new Date(drop.time)
          
          if ("date" in drop) if (drop.date) return new Date(drop.date)
        },
        color: (drop: Drop) => {
          return active === drop.key ? "firebrick" : "black"
        },
        onClick: (drop: Drop) => {
          // console.log(`Drop has been clicked!`, drop);
          // setActiveRowById(data.id)
        }
      }
    })
  }
  
  const renderChartData = (newChart: any) => {
    if (newChart)
      if (data)
        d3.select("#event-drops")
          .data([[data]])
          .call(chart)
    
    setSvgWidth()
  }
  
  useEffect(() => {
    chart = initializeChart()
    renderChartData(chart)
  }, [data, chartRange, active, containerWidth])
  
  useEffect(() => {
    const filterStartDate = centToDate(chartRange, startUnit)
    const filterEndDate = centToDate(chartRange, endUnit)
    
    setFilterRange([filterStartDate, filterEndDate])
  }, [chartRange, startUnit, endUnit])
  
  useEffect(() => {
    const filteredData = chart
      .filteredData()
      .reduce(
        (total: string | any[], repo: { data: any }) => total.concat(repo.data),
        []
      )
    
    const newFilteredData = filteredData.filter((item: any) => {
      let itemDate
      
      if ("time" in item) itemDate = new Date(item.time)
      
      if ("date" in item) itemDate = new Date(item.date)
      
      if (filterRange)
        if (itemDate >= filterRange[0] && itemDate <= filterRange[1])
          // --> because of null type that is used for initial it
          return item
    })
    
    if (onUpdate !== undefined)
      onUpdate(newFilteredData, filterRange, chartRange)
  }, [filterRange])
  
  const setSvgWidth = () => {
    const eventDrops = timelineRef?.current!
    let svg
    
    for (let element of eventDrops.children) {
      if (element.classList.contains("event-drop-chart")) svg = element
    }
    
    svg.setAttribute("width", "100%")
  }
  
  return (
    <Container dir="ltr">
      <div
        ref={timelineRef}
        id="event-drops"
        style={{ zIndex: 1, width: "100%" }}
      />
      
      {!filterOff && (
        <TimelineBox
          containerWidth={containerWidth}
          setContainerWidth={setContainerWidth}
          timelineRef={timelineRef}
        />
      )}
    </Container>
  )
}

export default TimeLineContainer
