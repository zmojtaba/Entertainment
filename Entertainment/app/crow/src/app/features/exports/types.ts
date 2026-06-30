export interface ExportsState {
  isOpen: boolean;
  selectMode: boolean;
  exportItems: Array<ExportItem>;
  selectedExportItems: Array<string>;
}

export interface ExportItem {
  type: "JSON" | "IMAGE";
  id: string;
  title: string;
  data: string;
}