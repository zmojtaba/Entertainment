import React, { useState, useEffect, useRef } from "react";
import { Divider, Button, Box, Grid, TextField } from "@mui/material";
import moment from "moment";
import Jmoment from "moment-jalaali";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AdapterJalali from '@date-io/date-fns-jalali';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AdapterMoment from "@date-io/moment";
import type { } from "@mui/x-date-pickers/themeAugmentation";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";

const DATE_FORMAT = {
  jalali: "yyyy/MM/dd HH:mm:ss",
  gregorian: "YYYY-MM-DD HH:mm:ss",
  gregorian2: "YYYY/MM/DD HH:mm:ss",
};

export enum languageId {
  FARSI = "fa",
  ENGLISH = "en",
}
/*
@Auhtor morgan 
  all right reserved :/
*/
type calType = 'gregorian' | 'jalali'
export type DatePickerError = { startTimeError: string, endTimeError: string }

export interface customDatePickerEventType {
  startDate: Jmoment.Moment;
  endDate: Jmoment.Moment;
  calType: calType;
}

interface propsType {
  calType?: calType;
  onChange(event: customDatePickerEventType): void;
  startDate: Jmoment.Moment;
  endDate?: Jmoment.Moment;
  mode: "dual" | "single";
  timePicker?: boolean;
  startLabel?: string;
  endLabel?: string;
  onError?(errors: DatePickerError): void;
  disabled?: boolean
}

export default React.memo((props: propsType) => {
  const { onChange: onChangeCallBack, mode, timePicker, } = props;
  const { t } = useTranslation("hamrah")
  const lang = useAppSelector(({ i18n }) => i18n.language);
  const direction = lang === languageId.ENGLISH ? "ltr" : "rtl";
  const [calType, setCalType] = useState<calType>(props.calType ?? "jalali")
  const [startDate, setStartDate] = useState<moment.Moment>(Jmoment().set({ hour: 0, minute: 0, second: 0 }))
  const [endDate, setEndDate] = useState<moment.Moment>(Jmoment().set({ hour: 23, minute: 59, second: 59 }))
  const [isOpen, setIsOpen] = useState({ start: false, end: false });
  const MyDateTimePicker = (timePicker ?? true) ? DateTimePicker : DatePicker
  const [errors, setErrors] = useState({ start: '', end: '' })
  const [firstLoad, setFirstLoad] = useState(true)
  const builtInError = useRef({ start: '', end: '' })
  const startLabel = props.startLabel ?? t('W52_3')
  const endLabel = props.endLabel ?? t('W53_2')
  const isDisabled = props?.disabled || false

  const switchCalType = () => {
    setCalType((oldCal) => {
      const newCalType = oldCal === "jalali" ? "gregorian" : "jalali"
      onChangeCallBack({
        calType: newCalType,
        startDate,
        endDate
      })
      return newCalType
    });
  };

  const validateTime = (startDate: Jmoment.Moment, endDate: Jmoment.Moment) => {
    if (!endDate || !startDate) {
      return {
        end: !endDate ? "تاریخ نمیتواند خالی باشد" : "",
        start: !startDate ? "تاریخ نمیتواند خالی باشد" : "",
      }
    }
    const errors = {
      start: builtInError.current.start,
      end: builtInError.current.end
    }
    if (errors.start || errors.end) {
      return errors
    } else {
      if (mode === "dual") {
        const compareError = (endDate.utc() < startDate.utc()) ? 'تاریخ پایان بایداز تاریخ شروع بزرگتر باشد' : ''
        return { ...errors, end: compareError }
      }
      return errors
    }
  }

  const handleChangeDate = (date: Jmoment.Moment, mode: 'startDate' | 'endDate') => {
    const data = {
      calType,
      startDate,
      endDate,
    }
    data[mode] = date
    onChangeCallBack(data)
  }

  useEffect(() => {
    if (!firstLoad) {
      const errs = validateTime(startDate, endDate)
      setErrors(errs)
      props?.onError?.({ startTimeError: errs.start, endTimeError: errs.end })
    }
  }, [startDate, endDate])

  useEffect(() => {
    setStartDate(props.startDate);
    if (mode == 'dual' && props.endDate)
      setEndDate(props.endDate);
    setFirstLoad(false)
    if (props.calType)
      setCalType(props.calType)
  }, [props?.endDate, props.startDate, props.calType])


  const toolbarComponent = () => {
    return (
      <>
        <Box sx={{ py: 1, mx: "auto" }}>
          <Button
            onClick={switchCalType}
            variant="outlined"
            sx={{ borderRadius: 5 }}
          >
            {calType === "jalali" ? "میلادی" : "jalali"}
          </Button>
        </Box>
        <Divider orientation="horizontal" variant="middle" flexItem />
      </>
    );
  };

  return (
    <Grid container alignItems="flex-start" sx={{ mt: 0.7, }} spacing={1} rowGap={1}>
      {calType === "jalali" ? (
        //@ts-ignore
        <LocalizationProvider dateAdapter={AdapterJalali} >
          <Grid item xs={12} md={mode === "dual" ? 6 : 12} >
            <MyDateTimePicker
              ampm={true}
              disableMaskedInput
              showToolbar
              open={isOpen.start}
              onError={(msg) => builtInError.current.start = msg}
              onOpen={() => setIsOpen({ ...isOpen, start: true })}
              onClose={() => setIsOpen({ ...isOpen, start: false })}
              inputFormat={DATE_FORMAT.jalali}
              ToolbarComponent={toolbarComponent}
              label={startLabel}
              value={startDate}
              onChange={(date) => {
                Jmoment.loadPersian({
                  usePersianDigits: false,
                });
                handleChangeDate(Jmoment(date), 'startDate');
              }}
              renderInput={(params) =>
                <TextField {...params}
                  fullWidth
                  sx={{ direction }}
                  size={'small'}
                  error={!!errors.start}
                  helperText={errors.start}
                />}
              disabled={isDisabled}
            />
          </Grid>
          {mode === "dual" ? (
            <Grid item xs={12} md={mode === "dual" ? 6 : 12}>
              <MyDateTimePicker
                ampm={true}
                disableMaskedInput
                showToolbar
                onError={(msg) => builtInError.current.end = msg}
                open={isOpen.end}
                onOpen={() => setIsOpen({ ...isOpen, end: true })}
                onClose={() => setIsOpen({ ...isOpen, end: false })}
                inputFormat={DATE_FORMAT.jalali}
                ToolbarComponent={toolbarComponent}
                label={endLabel}
                value={endDate}
                onChange={(date) => handleChangeDate(Jmoment(date), 'endDate')}
                renderInput={(params) => (
                  <TextField {...params}
                    fullWidth
                    sx={{ direction }}
                    size={'small'}
                    error={!!errors.end}
                    helperText={errors.end}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
          ) : ""
          }
        </LocalizationProvider>
      ) : ""
      }

      {calType === "gregorian" ? (  //@ts-ignore
        <LocalizationProvider adapterLocale={"en"} dateAdapter={AdapterMoment}>
          <Grid item xs={12} md={mode === "dual" ? 6 : 12}>
            <MyDateTimePicker
              ampm={true}
              disableMaskedInput
              onError={(msg) => builtInError.current.start = msg}
              onOpen={() => setIsOpen({ ...isOpen, start: true })}
              onClose={() => setIsOpen({ ...isOpen, start: false })}
              open={isOpen.start}
              showToolbar
              rifmFormatter={(date) => Jmoment(date, DATE_FORMAT.gregorian).format(DATE_FORMAT.gregorian)}
              inputFormat={DATE_FORMAT.gregorian}
              ToolbarComponent={toolbarComponent}
              label={startLabel}
              value={startDate}
              onChange={(date) => {
                Jmoment.loadPersian({ usePersianDigits: false })
                handleChangeDate(date!, 'startDate');
              }}
              renderInput={(params) => (
                <TextField {...params}
                  fullWidth
                  sx={{ direction }}
                  size={'small'}
                  error={!!errors.start}
                  helperText={errors.start}
                />
              )}
              disabled={isDisabled}
            />
          </Grid>
          {mode === "dual" ? (
            <Grid item xs={12} md={mode === "dual" ? 6 : 12}>
              <MyDateTimePicker
                ampm={true}
                disableMaskedInput
                onError={(msg) => builtInError.current.end = msg}
                open={isOpen.end}
                onOpen={() => setIsOpen({ ...isOpen, end: true })}
                onClose={() => setIsOpen({ ...isOpen, end: false })}
                showToolbar
                rifmFormatter={(date) => Jmoment(date, DATE_FORMAT.gregorian).format(DATE_FORMAT.gregorian)}
                inputFormat={DATE_FORMAT.gregorian}
                ToolbarComponent={toolbarComponent}
                label={endLabel}
                value={endDate}
                onChange={(date) => { handleChangeDate(date!, 'endDate') }}
                renderInput={(params) => (
                  <TextField {...params}
                    fullWidth
                    sx={{ direction }}
                    size={'small'}
                    error={!!errors.end}
                    helperText={errors.end}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
          ) : ""
          }
        </LocalizationProvider>
      ) : ""
      }
    </Grid>
  );
});

