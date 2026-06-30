import React, { useState } from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import { RiShareForwardLine } from "react-icons/ri"

import { useTranslation } from "react-i18next"
import _ from "lodash"
import { useGridApiContext } from "@mui/x-data-grid"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useAppSelector } from "app/store/hooks"
import { languageId } from "app/store/i18nSlice"
import Jmoment from "moment-jalaali"
import { DATE_FORMAT } from "app/constants"

const calTypeMode: { [key: string]: "jalali" | "gregorian" } = {
  gregorian: "gregorian",
  jalali: "jalali"
}

export const RedirectToolbar = () => {
  const [searchParams] = useSearchParams()
  const apiRef = useGridApiContext()
  const lang = useAppSelector(({ i18n }) => i18n.language)
  const CalTypeFromQuery = searchParams.get("calType")
  const calType = (CalTypeFromQuery && calTypeMode[CalTypeFromQuery]) ? calTypeMode[CalTypeFromQuery] : lang === languageId.FARSI ? "jalali" : "gregorian"
  const { t: translatedWords } = useTranslation("hamrah")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const redirect = (url: string | undefined) => {
    let dateFormate = calType === "gregorian" ? DATE_FORMAT.gregorian : DATE_FORMAT.jalali
    let selectedRows = apiRef.current.getSelectedRows()
    let data: string[] = []
    selectedRows.forEach((row) => {
      console.log("row", row)
      if (
        Object.hasOwn(row, "imei") ||
        Object.hasOwn(row, "imsi") ||
        Object.hasOwn(row, "telNumber")
      ) {
        data.push(
          `${row.telNumber ?? ""}-${row.imei ?? ""}-${row.imsi ?? ""}`
        )
      }
      else if (Object.hasOwn(row, "suspectId")) {
        data.push(
          `${row.suspectId.telNumber ?? ""}-${row.suspectId.imei ?? ""}-${row.suspectId.imsi ?? ""}`
        )
      }
      else if ("tcId" in row) {
        data.push(
          `${row.tcId.telNumber ?? ""}-${row.tcId.imei ?? ""}-${row.tcId.imsi ?? ""}`
        )
      }
    })
    let uniqueData = [..._.filter(data)]
    if (!uniqueData.length) {
      toast.error<string>(translatedWords("W197"), { autoClose: 5000 })
      return
    }
    
    let startDate = searchParams.get("startDate") ?? Jmoment().set({
      hour: 0,
      minute: 0,
      second: 0
    }).format(dateFormate)
    
    let endDate = searchParams.get("endDate") ?? Jmoment().set({
      hour: 23,
      minute: 59,
      second: 59
    }).format(dateFormate)
    
    let params = {
      calType: calType,
      startDate: startDate,
      endDate: endDate,
      suspects: uniqueData.join(",")
    }
    
    let redirectSearchParams = new URLSearchParams(params)
    let redirectUrl = `/${url}?${redirectSearchParams.toString()}`
    console.log(redirectUrl)
    window.open(redirectUrl, "_blank")
  }
  
  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<RiShareForwardLine />}
      >
        {translatedWords("W769")}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
      >
        {/* {[].map((item) => (
          <MenuItem key={item.text} onClick={() => redirect(item.url)}>
            {translatedWords(item.text)}
          </MenuItem>
        ))} */}
      </Menu>
    </>
  )
}


const x=[{asd:'asd'}]

