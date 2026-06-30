import React, { useCallback, useEffect, useMemo } from "react"
import { useAppDispatch } from "app/store/hooks"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { BROADCAST_TYPE, CONTENT_TYPE, EventMessage, Message, StatusMessage } from "@core/hooks/useBroadcast/types"
import { showMessage } from "app/store/core/messageSlice"
import i18next from "i18next"
import fa from "@core/components/Broadcast/i18n/fa"
import en from "@core/components/Broadcast/i18n/en"
import { BroadcastRootProps } from "./types"

i18next.addResourceBundle("fa", "broadcast", fa)
i18next.addResourceBundle("en", "broadcast", en)

const Broadcast = <
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
>(props: BroadcastRootProps<BT, ME, BE, BTM, MTB, CM>) => {
  
  const {
    children,
    broadcastType,
    onInitialMessage,
    onDataFromMain,
    onConfig,
    handlers
  } = props
  
  const dispatch = useAppDispatch()
  const { t } = useTranslation("aggregation")
  
  const [searchParams] = useSearchParams()
  const channelName = searchParams.get("channel")
  if (!channelName)
    throw new Error("Channel name is not valid!")
  
  const channel = useMemo(() => {
    return new BroadcastChannel(channelName)
  }, [])
  
  
  // close the broadcast channel connection and close the window
  const closeBroadcast = () => {
    if (channel)
      channel.close()
    window.close()
  }
  
  
  useEffect(() => {
    
    // notify main component that is ready
    // so send "ACK" message on broadcast channel
    sendStatus("ACK")
    
    // add broadcast message listener
    channel.onmessage = (broadcastMessage) => {
      const message: Message<BROADCAST_TYPE, CONTENT_TYPE> = broadcastMessage.data
      
      try {
        switch (message.contentType) {
          
          case "STATUS": {
            const message: Message<BT, CONTENT_TYPE.STATUS> = broadcastMessage.data
            console.log("message is unknown")
            console.log(message)
            
            if (message.data === "NACK")
              closeBroadcast()
            else
              throw ""
            break
          }
          
          case "CONFIG": {
            let message: Message<BT, CONTENT_TYPE.CONFIG, CM> = broadcastMessage.data
            onConfig && onConfig(message)
            break
          }
          
          case "DATA": {
            let message: Message<BT, CONTENT_TYPE.DATA, MTB> = broadcastMessage.data
            onDataFromMain && onDataFromMain(message.data)
            break
          }
          
          case "INITIAL_MESSAGE": {
            let message: Message<BT, CONTENT_TYPE.INITIAL_MESSAGE, MTB> = broadcastMessage.data
            onInitialMessage && onInitialMessage(message.data)
            break
          }
          
          case "EVENT_FROM_MAIN": {
            let message: Message<BT, CONTENT_TYPE.EVENT_FROM_MAIN, EventMessage<ME>> = broadcastMessage.data
            if (handlers)
              for (let handler of handlers)
                if (handler.eventName === message.data?.eventName) {
                  handler.callback(message.data.eventData)
                  return
                }
            break
          }
          
          default:
            throw "invalid message type"
        }
      }
      catch {
        dispatch(showMessage({
          message: t("AN_ERROR_HAS_OCCURRED"),
          variant: "error"
        }))
      }
    }
    
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault()
      sendStatus("NACK")
      return
    })
  }, [handlers])
  
  
  const sendDataToMain = useCallback((data: BTM) => {
    const message: Message<BT, CONTENT_TYPE.DATA, BTM> = {
      contentType: CONTENT_TYPE.DATA,
      broadcastType,
      data
    }
    
    channel.postMessage(message)
  }, [])
  
  /**
   * send status message that is notified for connection status
   * "ACK" for connect
   * "NACK" for disconnect
   */
  const sendStatus = useCallback((status: StatusMessage) => {
    const message: Message<BT, CONTENT_TYPE.STATUS> = {
      contentType: CONTENT_TYPE.STATUS,
      broadcastType,
      data: status
    }
    
    channel.postMessage(message)
  }, [])
  
  const sendEventToMain = useCallback((eventName: string, eventData: BE) => {
    const message: Message<BT, CONTENT_TYPE.EVENT_FROM_BROADCAST, EventMessage<BE>> = {
      contentType: CONTENT_TYPE.EVENT_FROM_BROADCAST,
      broadcastType,
      data: {
        eventData,
        eventName
      }
    }
    
    channel.postMessage(message)
  }, [])
  
  const deliveredProps = {
    channel,
    closeBroadcast,
    sendStatus,
    sendDataToMain,
    sendEventToMain
  }
  
  return (
    <div className="w-full h-full">
      {
        (children)(deliveredProps)
      }
    </div>
  )
}

export default Broadcast