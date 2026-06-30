import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useTranslation } from "react-i18next"

interface PropsType {
  open: boolean;
  onClose: (val: boolean) => void;
  okLabel?: string;
  cancelLabel?: string;
  onOkClick: () => void;
  title?: string;
  message: string;
}

export default function ConfirmDialogComponent(props: PropsType) {
  const { okLabel, cancelLabel, open, onClose, onOkClick, title, message } = props
  const { t } = useTranslation("general")

  return (
    <Dialog maxWidth="xs" open={open}>
      <DialogTitle sx={{ p: 0, py: .9, fontSize: 15 }}>
        <WarningAmberIcon sx={{ mx: 1 }} color="warning" />
        {title ?? t("WARNING")}
      </DialogTitle>
      <DialogContent dividers sx={{ py: 4, fontSize: '1.4rem' }}>
        {message}
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={() => { onClose(false) }} >
          {" "}
          {cancelLabel ?? t("NO")}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            onOkClick()
            onClose(false)
          }}
        >
          {okLabel ?? t("YES")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
