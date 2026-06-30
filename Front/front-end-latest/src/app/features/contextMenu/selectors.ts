import {
  CaretContextMenuItem,
  CaretContextMenuNested,
  ContextMenuState,
  RangeContextMenuItem,
  RangeContextMenuNested
} from "./types"

type IRangeItems = (RangeContextMenuItem | RangeContextMenuNested)[];
type ICaretItems = (CaretContextMenuItem | CaretContextMenuNested)[];

interface ISeparateRangeAndCaretItems {
  (ContextMenuState: ContextMenuState, element: HTMLElement | null): {
    rangeItems: IRangeItems,
    caretItems: ICaretItems,
  }
}
export const separateRangeAndCaretItems: ISeparateRangeAndCaretItems = (ContextMenuState, element) => {
  let rangeItems: IRangeItems = [];
  let caretItems: ICaretItems = [];
  const ignoredCaretElements = ContextMenuState.ignoredCaretElements
  const allCarets = [...ContextMenuState.globalCaretItems, ...ContextMenuState.caretItems];
  const allRangeItems = [...ContextMenuState.globalRangeItems, ...ContextMenuState.rangeItems]

  caretItems = allCarets.filter(item => {
    if (item.element === "document" || item.element.contains(element)) {
      // if element included in ignored items, it should be ignored and not show that element
      for (const ignoredElement of ignoredCaretElements) {
        if (ignoredElement.contains(element))
          return false
      }
      return true
    }

    return false
  })

  rangeItems = allRangeItems.filter(item => {
    if (item.element === "document")
      return true

    if (item.element.contains(element))
      return true

    return false
  })

  return {
    rangeItems,
    caretItems
  }
}