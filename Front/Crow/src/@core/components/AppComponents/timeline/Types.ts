import { Dispatch, SetStateAction } from "react"
import { IDateRange } from "@core/types"

export interface UnitType {
  startUnit: number
  endUnit: number
  setStartUnit: Dispatch<SetStateAction<number>>
  setEndUnit: Dispatch<SetStateAction<number>>
  moveBox: (amount: number) => void
}

export interface TimelineProps {
  allData: Array<Drop>
  onUpdate?: OnUpdate
  initialRange: IDateRange
  playable?: boolean
  activeDropId?: string
  filterOff?: boolean
}

export interface Drop {
  time?: number
  key?: string
  
  date?: string
  id?: string
  
  [index: string]: any
}

export interface DataType {
  name: string
  data: Array<Drop>
}

export type OnUpdate = (filteredData: Array<Drop>, filterRange: IDateRange, chartRange: IDateRange) => void