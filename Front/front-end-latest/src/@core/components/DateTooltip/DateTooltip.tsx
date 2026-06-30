import React, { useCallback } from "react"
import Divider from "@mui/material/Divider"
import { DateItem, DatesContainer, StyledTooltip } from "./styledComponents"
import { useTranslation } from "react-i18next"
import jformat from "date-fns-jalali/format"
import format from "date-fns/format"
import { TooltipProps } from "@mui/material/Tooltip/Tooltip"

type Props = {
  date?: Date | null
  children: React.ReactElement<any, any>
  // title should not pass as props because it is created and rendered in this component
  // if title passed it will overwrite to created title, and we don't want this :)
  // so omit title from tooltip props type
  tooltipProps?: Omit<TooltipProps, "title">
}

const DateTooltip = (props: Props) => {
  const {
    date,
    children,
    tooltipProps
  } = props
  
  const { t } = useTranslation("general")
  
  const renderTooltip = useCallback(
    (date: Date) => {
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
      
      // hijri qamari (lunar) format
      const hijriFormat = new Date(date).toLocaleDateString("ar-SA-u-nu-arab", dateOptions).split(" ")[0]
      
      // jalali (solar) format
      const jalaliFormat = jformat(date, "yyyy/MM/dd")
      
      // miladi (gregorian) format
      const gregorianFormat = format(date, "yyyy/MM/dd")
      
      const time = format(date, "HH:mm:ss")
      
      return (
        <DatesContainer>
          <DateItem>
            <span>{t("GREGORIAN")}</span>
            <span>{gregorianFormat}</span>
          </DateItem>
          
          <DateItem>
            <span>{t("SHAMSI")}</span>
            <span>{jalaliFormat}</span>
          </DateItem>
          
          <DateItem>
            <span>{t("QAMARI")}</span>
            <span>{hijriFormat}</span>
          </DateItem>
          
          <Divider />
          
          <DateItem>
            <span>{t("TIME")}</span>
            <span>{time}</span>
          </DateItem>
        </DatesContainer>
      )
    },
    [t]
  )
  
  if (date) {
    return (
      <StyledTooltip
        placement="top"
        title={renderTooltip(date)}
        followCursor
        {...tooltipProps}
      >
        {children}
      </StyledTooltip>
    )
  }
  else {
    return (
      <>{children}</>
    )
  }
}

export default DateTooltip
