const environment = import.meta.env.NODE_ENV
const environmentNet = import.meta.env
const hostname = window.location.hostname
const protocol = window.location.protocol
console.log("environmentNet",environmentNet);


const baseServerAddress = environment === "development" ? `${protocol}//${hostname}` : `${protocol}//${hostname}`
// const baseServerAddress = environment === "development" ? `http://10.211.47.233` : `http://10.211.47.233`
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