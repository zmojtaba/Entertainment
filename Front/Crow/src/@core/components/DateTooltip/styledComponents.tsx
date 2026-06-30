import { alpha, styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip"

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: alpha(theme.palette.text.primary, 0.9),
    maxWidth: 220,
    padding: theme.spacing(1),
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid",
    borderColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius / 2
  }
}))

export const DatesContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1)
}))

export const DateItem = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(7)
}))