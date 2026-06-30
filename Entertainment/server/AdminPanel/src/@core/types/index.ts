export enum API_STATUS {
  NOT_FETCHED = "NOT_FETCHED",
  SUCCESS = "SUCCESS",
  LOADING = "LOADING",
  ERROR = "ERROR"
}

type IKeyType = {
  [index: string]: Array<string>;
}

export type IRawNode = {
  id: number,
  label: string,
  object: string,
  rowId: string,
}
export type IRawEdge = {
  id: number,
  rowId: string,
  sourceId: number,
  destinationID: number,
  label: string,
  direction: string,
  properties?: {
    [key: string]: string | Date | number | boolean
  } | null
}
export type IRawData = {
  vertices: IRawNode[],
  edges: IRawEdge[]
}

export type ISearchResultItem = {
  id: string;
  type: string;
  properties: any; // this is not any and should be changed to PropertiesType
  keyType: IKeyType;
  tags: Array<string>;
  createdDate: string;
  createdBy: string;
  dataType: string;
  dataSource: string;
  graph: IRawData;
}

export type IDateRange = [Date, Date]

export type IDateItem = {
  id: string;
  key: string;
  date: Date;
}

