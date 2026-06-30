import Button from "@mui/material/Button"
import { useTranslation } from "react-i18next"
import { useGridApiContext } from "@mui/x-data-grid"

interface propsType {
  onClick: (api: ReturnType<typeof useGridApiContext>, e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  icon: JSX.Element
}

export default function CustomButton({ icon, title, onClick }: propsType) {
  const { t } = useTranslation("hamrah")
  const apiRef = useGridApiContext()
  return (
    <Button onClick={(e) => onClick(apiRef, e)} startIcon={icon}>
      {t(title)}
    </Button>
  )
}
