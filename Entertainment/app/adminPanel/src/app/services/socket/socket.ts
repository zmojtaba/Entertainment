import * as StompJs from "@stomp/stompjs"
import { ConnectProps } from "./Types"

export const connect = (props: ConnectProps) => {

  const client = new StompJs.Client({
    brokerURL: 'ws://172.16.8.144:15672',
    connectHeaders: {
      login: "admin",
      passcode: "admin"
    },
    debug: function (str) {
      // console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000
  })

  const {
    onReceive,
    onError,
    onConnect,
    onDisconnect
  } = props

  client.activate()
  client.onDisconnect = (frame) => {
    onDisconnect && onDisconnect(frame)
  }
  client.onConnect = (frame) => {

    onConnect && onConnect(frame)

    client.subscribe(`/exchange/${props.exchange}`, onReceive);


    // Do something, all subscribes must be done is this callback
    // This is needed because this will be executed after a (re)connect
  }

  client.onStompError = (frame) => {
    // Will be invoked in case of error encountered at Broker
    // Bad login/passcode typically will cause an error
    // Complaint brokers will set `message` header with a brief message. Body may contain details.
    // Compliant brokers will terminate the connection after any error
    console.log("Broker reported error: " + frame.headers["message"])
    console.log("Additional details: " + frame.body)

    if (onError)
      onError(frame)
  }

  return client
}




