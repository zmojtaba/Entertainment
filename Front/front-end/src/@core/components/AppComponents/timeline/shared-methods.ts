import { containerWidthGlobal } from "./TimelineBox"
import { IDateRange } from "../../../types"

export const xToCent = (deviceWidth: number, x: number): number => {
  const centWidth = deviceWidth / containerWidthGlobal
  
  // return number of cent
  return (x - (x % centWidth)) / centWidth
}

export const centToX = (deviceWidth: number, cent: number): number => {
  const centWidth = deviceWidth / containerWidthGlobal
  return cent * centWidth
}

export const dateToCent = (
  range: IDateRange,
  date: Date,
  containerWidth?: number
): number => {
  if (containerWidthGlobal || !containerWidth)
    containerWidth = containerWidthGlobal
  
  const start = range[0].getTime()
  const end = range[1].getTime()
  const dateNumber = date.getTime()
  
  const centWidth = (end - start) / containerWidth
  
  const scaleToNumbersFromZero = dateNumber - start
  
  const scaledToFirstNumberOfCollection =
    scaleToNumbersFromZero - (scaleToNumbersFromZero % centWidth)
  
  const cent = scaledToFirstNumberOfCollection / centWidth
  
  return cent
}

export const centToDate = (range: IDateRange, cent: number) => {
  const start = range[0].getTime()
  const end = range[1].getTime()
  
  if (cent === 0) return new Date(start)
  
  const centWidth = (end - start) / containerWidthGlobal
  const result = start + cent * centWidth
  
  return new Date(result)
}

export const calcCentByDate = (range: IDateRange) => {
  const start = range[0].getTime()
  const end = range[1].getTime()
  
  return (end - start) / containerWidthGlobal
}

// get start and end units and return width of draggable box
export const calcWidth = (
  containerWidth: number,
  start: number,
  end: number
) => {
  return centToX(containerWidth, end) - centToX(containerWidth, start)
}

export const computeInitialRangeForTimeLineBox = (
  range: IDateRange
): IDateRange => {
  const onePercentOfRange = (range[1].getTime() - range[0].getTime()) / 100
  
  const newStart = range[0].getTime() + 25 * onePercentOfRange
  const newEnd = range[1].getTime() - 25 * onePercentOfRange
  
  return [new Date(newStart), new Date(newEnd)]
}
