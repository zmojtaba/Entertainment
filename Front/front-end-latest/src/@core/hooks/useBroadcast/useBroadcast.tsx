import { useCallback, useEffect, useMemo, useState } from "react"
import { v4 as uuid } from "uuid"
import {
  BROADCAST_TYPE,
  BroadcastProps,
  BroadcastReturnType,
  CONTENT_TYPE,
  EventMessage,
  Message,
  StatusMessage
} from "./types"

export const useBroadcast = <
  // BT: Broadcast Type
  BT extends BROADCAST_TYPE,
  // MTB: Main to Broadcast Message
  MTB,
  // BTM: Broadcast to Main Message
  BTM,
  // ME: Main Events
  ME = null,
  // BE: Broadcast Events
  BE = null,
  // CM: Config Message
  CM = null
>(props: BroadcastProps<BT, CM, BE, BTM>): BroadcastReturnType<MTB, ME> => {
  
  const {
    broadcastType,
    config,
    onDisconnect,
    onConnect,
    onDataFromBroadcast,
    handlers,
    isPopup = false,
    broadcastUrl = null
  } = props
  
  // show connection status
  const [isConnected, setIsConnected] = useState<boolean>(false)
  
  const channel = useMemo(() => new BroadcastChannel(uuid()), [])
  
  useEffect(() => {
    channel.onmessage = (broadcastMessage) => {
      
      const message: Message<BT, CONTENT_TYPE> = broadcastMessage.data
      
      if (message.contentType === CONTENT_TYPE.STATUS) {
        // now message is a status message and contain info about connection
        const message = broadcastMessage.data as Message<BT, CONTENT_TYPE.STATUS, StatusMessage>
        
        if (message.data === "ACK") connectHandler()
        else if (message.data === "NACK") disconnectHandler()
        else throw new Error("Got an unknown message")
        
      }
      else if (message.contentType === CONTENT_TYPE.EVENT_FROM_BROADCAST) {
        
        // now message is an event message and contain info about triggered event
        // that fired in the broadcast window
        const message = broadcastMessage.data as Message<BT, CONTENT_TYPE.EVENT_FROM_BROADCAST, EventMessage<BE>>
        
        // if handler passed and the event names were same,
        // so handler will be executed
        if (handlers)
          for (let handler of handlers)
            if (handler.eventName === message.data?.eventName) {
              handler.callback(message.data.eventData)
              return
            }
      }
      else if (message.contentType === CONTENT_TYPE.DATA) {
        
        // handles data messages Broadcast
        const message = broadcastMessage.data as Message<BT, CONTENT_TYPE.EVENT_FROM_BROADCAST, BTM>
        onDataFromBroadcast && onDataFromBroadcast(message.data)
        
      }
      else
        throw new Error("this type of message is not valid")
      
    }
  }, [])
  
  
  /**
   * send broadcast component custom config
   * just once after "ACK" message is received
   */
  const sendConfig = () => {
    if (config) {
      const configMessage: Message<BT, CONTENT_TYPE.CONFIG, CM> = {
        contentType: CONTENT_TYPE.CONFIG,
        broadcastType,
        data: { ...config }
      }
      channel.postMessage(configMessage)
    }
  }
  
  
  /**
   * send data from main to broadcast
   */
  const sendDataToBroadcast = (data: MTB) => {
    
    // check connection
    if (isConnected) {
      const broadcastMessage: Message<BT, CONTENT_TYPE.DATA, MTB> = {
        broadcastType,
        contentType: CONTENT_TYPE.DATA,
        data
      }
      channel.postMessage(broadcastMessage)
    }
    else {
      console.error("You want to send message but channel is not connected yet!")
    }
  }
  
  
  /**
   * send initial broadcast message
   */
  const sendInitialMessage = (data: MTB) => {
    // check connection
    if (isConnected) {
      const initialMessage: Message<BT, CONTENT_TYPE.INITIAL_MESSAGE, MTB> = {
        broadcastType,
        contentType: CONTENT_TYPE.INITIAL_MESSAGE,
        data
      }
      channel.postMessage(initialMessage)
    }
    else {
      console.error("You want to send message but channel is not connected yet!")
    }
  }
  
  
  /**
   * send event from main component
   */
  const sendEventToBroadcast = (eventName: string, eventData: ME) => {
    if (isConnected) {
      const broadcastMessage: Message<BT, CONTENT_TYPE.EVENT_FROM_MAIN, EventMessage<ME>> = {
        contentType: CONTENT_TYPE.EVENT_FROM_MAIN,
        broadcastType,
        data: {
          eventName,
          eventData
        }
      }
      channel.postMessage(broadcastMessage)
    }
    else {
      console.error("You want to send message but channel is not connected yet!")
    }
  }
  
  
  /**
   * this method opens a new broadcast tab/window
   * broadcast url is based on your origin url and channel name
   */
  const openNewWindow = useCallback(() => {
    const broadcastComponent = broadcastType.toLowerCase()
    const channelName = channel.name
    const defaultUrl = `/broadcast/${broadcastComponent}`
    const url = window.location.origin + `${broadcastUrl || defaultUrl}?channel=${channelName}`
    window.open(url, "", `popup=${isPopup}`)
  }, [channel, broadcastType])
  
  
  /**
   * this method is runs after the broadcast connects to channel
   */
  const connectHandler = () => {
    sendConfig()
    setIsConnected(true)
    
    if (onConnect)
      onConnect()
    
    console.log("Channel is connected. ✅")
  }
  
  
  /**
   * this method runs after the broadcast window close
   * and disconnect from channel
   */
  const disconnectHandler = () => {
    setIsConnected(false)
    
    if (onDisconnect)
      onDisconnect()
    
    console.log("Channel is disconnected. ❌")
  }
  
  
  /**
   * send status message that is notified for connection status
   * "ACK" for connect
   * "NACK" for disconnect
   */
  const sendStatus = (status: StatusMessage) => {
    const message: Message<BT, CONTENT_TYPE.STATUS, StatusMessage> = {
      broadcastType,
      contentType: CONTENT_TYPE.STATUS,
      data: status
    }
    channel.postMessage(message)
    
  }
  
  useEffect(() => {
    
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      sendStatus("NACK")
      return
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    
    // close broadcast channel before unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      channel.close()
    }
  }, [])
  
  return {
    isConnected,
    sendStatus,
    openNewWindow,
    sendInitialMessage,
    sendDataToBroadcast,
    sendEventToBroadcast
  }
}

