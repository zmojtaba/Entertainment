import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import classes from "./style.module.scss";
import clsx from "clsx";

interface PropsType {
  open: boolean;
  onClose: (val: boolean) => void;
  okLabel?: string;
  cancelLabel?: string;
  onOkClick: () => void;
  title?: string;
  message: string;
  twoSteps?: boolean;
}

const generateRandomNumber = () => {
  return (Math.floor(1000 + Math.random() * 9000).toString());
}


export default function ConfirmDialogComponent(props: PropsType) {
  const { okLabel, cancelLabel, open = true, onClose, onOkClick, title, message, twoSteps } = props
  const { t } = useTranslation("general")
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [generatedCode, dispatchCode] = useReducer(generateRandomNumber, '')
  const [numbers, setNumbers] = useState(['', '', '', ''])
  const inputElementsRef = useRef<(HTMLDivElement | null)[]>([])
  const [isError, setIsError] = useState(false)
  const okBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    dispatchCode();
  }, [])

  const handleKeyUp = (e, index) => {
    const value = numbers[index]
    let newNumbers = [...numbers]
    if (e.key == "Backspace") {
      !value ? index = index - 1 : newNumbers[index] = ''

    } else if (parseInt(e.key) >= 0) {
      newNumbers[index] = e.key
      index = index + 1
    }

    setNumbers(newNumbers)
    setIsError(false)

    if (newNumbers.join('').length == 4) {
      okBtnRef.current?.removeAttribute('disabled')
      okBtnRef.current?.focus();

    } else {
      inputElementsRef.current[index]?.querySelector("input")?.focus()
    }
  }

  const validateCode = () => {
    var inputValue = numbers.join('')
    if (inputValue == generatedCode) {
      onOkClick()
      onClose(false)
    } else {
      setIsError(true)
    }
  }

  const handleCloseModal = () => {
    onClose(false);
    setShowCodeEntry(false)
  }

  return (
    <Dialog
      maxWidth={false}
      open={open}
      className={classes.container}
      disablePortal
    >
      <DialogTitle sx={{ p: 0, py: .9, fontSize: 17 }}>
        <WarningAmberIcon sx={{ mx: 1 }} color="warning" />
        {title ?? t("Warning")}
      </DialogTitle>

      <DialogContent dividers sx={{ fontSize: '1.4rem' ,direction:'ltr'}} >
        <div className={classes.content}>
          <div className={clsx(classes.message, showCodeEntry && classes.scroll)} >
            {message}
          </div>

          {twoSteps &&
            <div className={classes.verificationCode} >
              <div className={classes.generatedCode} onClick={dispatchCode} >
                {generatedCode}
              </div>
              <div>
                <p>{t("ENTER_TEXT_ABOVE")}</p>
              </div>
              <div className={classes.boxGetCode}>
                {generatedCode?.split('').map((data, index) => {
                  return (
                    <TextField
                      className={clsx(isError ? "animated flash " : '')}
                      key={index}
                      ref={(element) => { inputElementsRef.current[index] = element }}
                      error={numbers.join('').length == 4 && isError}
                      value={numbers[index]}
                      onKeyUp={(e) => handleKeyUp(e, index)}
                      inputProps={{ maxLength: 1 }}
                    />
                  )
                })}
              </div>
            </div>
          }
        </div>
      </DialogContent>

      <DialogActions sx={{ overflow: 'hidden', p: 1 }}>
        <div className={clsx(classes.actions, showCodeEntry && classes.scroll)}>
          <div className={clsx(classes.yesNoBtn)}>
            <Button size="small" onClick={handleCloseModal} >
              {cancelLabel ?? t("No")}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                twoSteps ? setShowCodeEntry(true) : onOkClick()
              }}
            >
              {okLabel ?? t("Yes")}
            </Button>
          </div>

          <div className={classes.okCancelBtn}>
            <Button color="error" onClick={handleCloseModal} size="small">
              {t("CANCEL")}
            </Button>

            <Button
              ref={okBtnRef}
              size="small"
              disabled={numbers.join('').length == 4 ? false : true}
              variant="contained"
              onSelect={() => { console.log("elected") }}
              onClick={validateCode}>
              {t("OK")}
            </Button>
          </div>

        </div>

      </DialogActions>
    </Dialog>
  )
}
