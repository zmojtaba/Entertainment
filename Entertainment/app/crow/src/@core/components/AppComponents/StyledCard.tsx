import { styled } from "@mui/material/styles"
import Card from "@mui/material/Card"
import TextField from '@mui/material/TextField'

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "bgPosition"
})<{ bgPosition?: string }>(({ theme, bgPosition = "top" }) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  width: "100%",
  backgroundImage:
    bgPosition === "top" && theme.palette.mode === "dark"
      ? `url(/assets/images/backgrounds/card_bg_dark.svg)`
      : theme.palette.mode === "light" && bgPosition === "top"
        ? `url(/assets/images/backgrounds/card_bg.svg)`
        : theme.palette.mode === "light" && bgPosition === "bl"
          ? `url(/assets/images/backgrounds/card_bg_bottom.svg)`
          : theme.palette.mode === "light" && bgPosition === "br"
            ? `url(/assets/images/backgrounds/card_bg_br.svg)`
            : theme.palette.mode === "light" && bgPosition === "both"
              ? `url(/assets/images/backgrounds/card_bg.svg), url(/assets/images/backgrounds/card_bg_bottom.svg)`
              : theme.palette.mode === "dark" && bgPosition === "both"
                ? `url(/assets/images/backgrounds/card_bg_dark.svg), url(/assets/images/backgrounds/card_bg_bottom_dark.svg)`
                : "none",
  backgroundSize: "contain",
  backgroundPosition:
    bgPosition === "bl"
      ? "30% 100%"
      : bgPosition === "br"
        ? "100% 100%"
        : bgPosition === "top"
          ? "100% 0"
          : bgPosition === "both"
            ? "0 0%, 100% 100%"
            : "none",
  padding: `${theme.spacing(2)} ${theme.spacing(3.5)}`,
  backgroundRepeat: "no-repeat",
  boxShadow: "none"
}))
