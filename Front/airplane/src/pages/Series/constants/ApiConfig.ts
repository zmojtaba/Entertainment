const environment = import.meta.env.NODE_ENV
const hostname = window.location.hostname
const protocol = window.location.protocol

// const baseServerAddress = environment === "development" ? `${protocol}//${hostname}` : `${protocol}//${hostname}`
const baseServerAddress = environment === "development" ? `http://192.168.1.1` : `${protocol}//${hostname}`
const socketAddress = environment === "development" ? "ws://192.168.1.1" : `ws://${hostname}`


const serverPort = environment === "development" ? 5030 : 5030




export const API_CONFIG = {
  hostname,
  baseServerAddress,
  serverPort,
  movie: `${baseServerAddress}:${serverPort}`,
  plateDetection: `${baseServerAddress}:${serverPort}`,
  websocket: `${socketAddress}:15674/ws`,
}