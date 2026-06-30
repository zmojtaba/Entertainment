import { AnchorPoint, SelectionMode } from "@core/hooks/useContextMenu/types"

export interface ContextMenuState {
  caretItems: CaretContextMenuItem[] | CaretContextMenuNested[];
  rangeItems: RangeContextMenuItem[] | RangeContextMenuNested[];
  globalCaretItems: CaretContextMenuItem[] | CaretContextMenuNested[];
  globalRangeItems: RangeContextMenuItem[] | RangeContextMenuNested[];
  ignoredCaretElements: HTMLElement[]
  ignoredRangeElements: HTMLElement[]
}

export type RangeContextMenuItem = ContextMenuItem<"RANGE", false>
export type CaretContextMenuItem = ContextMenuItem<"CARET", false>

export type RangeContextMenuNested = ContextMenuItem<"RANGE", true>
export type CaretContextMenuNested = ContextMenuItem<"CARET", true>

export interface ContextMenuItem<T extends SelectionMode, B extends boolean> {
  type: T;
  label: string;
  callback: ContextMenuCallback<T, B>;
  element: HTMLElement | "document"; // if menu item is global so element would be "document"
  icon?: JSX.Element;
  divider?: "top" | "bottom" | "both";
  children: ExistChildren<T, B>;
  isNested: B;
  uuid: string;
  renderFor?: string //html element localName for ex: 'img svg button'
}

type ContextMenuCallback<T extends SelectionMode, B extends boolean> =
  B extends true
  ?
  null
  :
  T extends "CARET"
  ? (anchorPoint: AnchorPoint, selectedText: string, selectedElement?: HTMLElement) => void
  : (anchorPoint: AnchorPoint, selectedText: string, selectedElement?: HTMLElement) => void


// write recursive type
// getting type by selectionMode and isNested value

type ExistChildren<T extends SelectionMode, B extends boolean> =
  B extends true
  ? T extends "RANGE"
  ? RangeContextMenuItem[] | RangeContextMenuNested[]
  : CaretContextMenuItem[] | CaretContextMenuNested[]
  : null
