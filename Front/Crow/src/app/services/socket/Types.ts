import { IFrame } from "@stomp/stompjs"
import { IMessage } from "@stomp/stompjs/src/i-message"
import * as StompJs from "@stomp/stompjs"

export interface ConnectProps {
  exchange: string
  onReceive: (message: IMessage) => void
  onError?: (frame: IFrame) => void
  onConnect?: (frame: IFrame) => void
  onDisconnect?: (frame: IFrame) => void;
}