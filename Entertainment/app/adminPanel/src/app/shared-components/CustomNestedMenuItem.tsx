import React, { PropsWithChildren } from "react"
import { NestedMenuItem, NestedMenuItemProps } from "mui-nested-menu"
import BackArrowIcon from "@mui/icons-material/ChevronLeft"
import NextArrowIcon from "@mui/icons-material/NavigateNext"
import { useAppSelector } from "app/store/hooks"
import { languageId } from "app/store/i18nSlice"

export default (props: PropsWithChildren<NestedMenuItemProps>) => {
  const { children, dir, ...otherProps } = props
  const lang = useAppSelector(({ i18n }) => i18n.language)
  const isFarsi = dir ? dir === "rtl" : lang === languageId.FARSI
  return (//@ts-ignore
    <NestedMenuItem
       {...otherProps}
      rightIcon={isFarsi ? <BackArrowIcon /> : <NextArrowIcon />}
      ContainerProps={{
        style: {
          direction: isFarsi ? "rtl" : "ltr"
        }
      }}
      MenuProps={{
        anchorOrigin: {
          vertical: "top",
          horizontal: isFarsi
            ? "left"
            : "right"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: isFarsi
            ? "right"
            : "left"
        },
        sx: { display: props.disabled ? "none" : "unset" }
      }}
      placeholder={''}    >
      {children}
    </NestedMenuItem>
  )
};
