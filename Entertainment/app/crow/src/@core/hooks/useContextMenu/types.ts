export interface AnchorPoint {
  x: number;
  y: number;
}

// select text then right-click ==> RANGE
// simple right-click ==> CARET
export type SelectionMode = "RANGE" | "CARET"

export type UseContextMenuReturnType = {
  anchorPoint: AnchorPoint
  show: boolean
  mode: SelectionMode | null
  close: () => void
  selectedText: string | null
  element: HTMLElement | null
}