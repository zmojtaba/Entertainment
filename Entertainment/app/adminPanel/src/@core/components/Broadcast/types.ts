import { BROADCAST_TYPE, CONTENT_TYPE, Handler, Message, StatusMessage } from "../../hooks/useBroadcast/types"
import React from "react"

export type BroadcastRootProps<T extends BROADCAST_TYPE, ME, BE, BTM, MTB, CM> = {
  broadcastType: T
  onInitialMessage?: (initialMessage: MTB) => void
  onDataFromMain?: (data: MTB) => void
  onConfig?: (config: Message<T, CONTENT_TYPE.CONFIG, CM>) => void
  handlers?: Array<Handler<ME>>;
  children: (bag: BroadcastFeedProps<T, BE, BTM>) => React.ReactNode
}

export type BroadcastFeedProps<T extends BROADCAST_TYPE, BE, BTM> = {
  channel: BroadcastChannel,
  closeBroadcast: () => void,
  sendStatus: (status: StatusMessage) => void,
  sendDataToMain: (data: BTM) => void
  sendEventToMain: (eventName: string, eventData: BE) => void
}
