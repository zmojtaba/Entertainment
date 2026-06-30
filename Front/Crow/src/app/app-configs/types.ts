import { PaletteOptions, ThemeOptions } from "@mui/material"

export type NavigationItem = {
  id: string
  title: string
  type: string
  auth?: string[] | null
  translate?: string
  icon?: any
  image?:string,
  url?: string
  iconClass?: string
  target?: string
  children?: NavigationItem[]
}

export type ThemeRecord = Record<string, ThemeOptions>