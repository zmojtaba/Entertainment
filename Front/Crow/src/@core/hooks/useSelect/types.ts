export interface UseSelectReturnType<T extends string | number> {
  isSelectMode: boolean;
  selectedItems: T[];
  toggleMode: () => void;
  selectItem: (id: T) => void;
  deselectItem: (id: T) => void;
  setSelect: (ids: T[]) => void;
  deselectAll: () => void;
}