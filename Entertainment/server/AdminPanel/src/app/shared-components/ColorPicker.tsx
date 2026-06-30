import { IconButton } from "@mui/material"
import React from "react"
import PaletteIcon from "@mui/icons-material/Palette"
import { useDebouncedCallback } from "use-debounce"

interface PropsType {
  color: string;
  onChange(color: string): void;
  debounce?: number;
  disabled?: boolean;
  iconFontSize?: "small" | "medium" | "large";
}

export default function ColorPicker(props: PropsType) {
  const { color, onChange, debounce, iconFontSize, disabled } = props
  
  const onChangeColor = useDebouncedCallback((color: string) => {
    onChange(color)
  }, debounce)
  
  return (
    <IconButton component="label" size="small" disabled={disabled}>
      <input
        style={{ width: 0, height: 0, visibility: "hidden" }}
        type="color"
        value={color}
        onChange={(e) => onChangeColor(e.target.value)}
        disabled={disabled}
      />
      <PaletteIcon
        sx={{ color: theme => disabled ? theme.palette.grey[400] : props.color }}
        fontSize={iconFontSize}
      />
    </IconButton>
  )
}

ColorPicker.defaultProps = {
  debounce: 400,
  disabled: false,
  iconFontSize: "medium"
}