
export enum BROADCAST_TYPE {
  MAP = "MAP",
  GRAPH = "GRAPH",
  AGGREGATION = "AGGREGATION",
  AGGREGATION_RESULT = "AGGREGATION_RESULT"
}

export enum CONTENT_TYPE {
  STATUS = "STATUS",
  INITIAL_MESSAGE = "INITIAL_MESSAGE",
  DATA = "DATA",
  CONFIG = "CONFIG",
  EVENT_FROM_BROADCAST = "EVENT_FROM_BROADCAST",
  EVENT_FROM_MAIN = "EVENT_FROM_MAIN",
}

export type StatusMessage = "ACK" | "NACK"

export type BroadcastProps<BT extends BROADCAST_TYPE, CM, BE, BTM> = {
  broadcastType: BT;
  config?: CM;
  onDisconnect?: () => void;
  onConnect?: () => void;
  onDataFromBroadcast?: (data: BTM) => void
  handlers?: Array<Handler<BE>>;
  isPopup?: boolean,
  broadcastUrl?: string
}

export type Handler<BE> = {
  eventName: string;
  callback: (eventData: BE) => void;
}

export type BroadcastReturnType<MTB, ME> = {
  isConnected: boolean,
  sendDataToBroadcast: (message: MTB) => void,
  sendInitialMessage: (initialMessage: MTB) => void,
  sendEventToBroadcast: (eventName: string, eventData: ME) => void,
  openNewWindow: () => void,
  sendStatus: (status: StatusMessage) => void
}

export type Message<BT extends BROADCAST_TYPE, K extends CONTENT_TYPE, D = unknown> = {
  broadcastType: BT;
  contentType: K;
  data: D;
}

export type EventMessage<D> = {
  eventName: string
  eventData: D
}

export interface Point {
  coordinate: any;
  id: string;
  active?: boolean
  
  [key: string]: any;
}