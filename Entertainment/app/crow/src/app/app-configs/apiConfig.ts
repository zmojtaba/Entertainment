const environment = process.env.NODE_ENV
const hostname = window.location.hostname
const protocol = window.location.protocol

// const baseServerAddress = environment === "development" ? `http://192.168.151.2` : `${protocol}//${hostname}`
// const socketAddress = environment === "development" ? "ws://192.168.151.2" : `ws://${hostname}`

// const baseServerAddress = environment === "development" ? `${protocol}//${hostname}` : `${protocol}//${hostname}`
const baseServerAddress = environment !== "development" ? `http://172.16.8.114` : `${protocol}//${hostname}`
const socketAddress = environment === "development" ? "ws://172.16.8.114" : `ws://${hostname}`


const mlServicesAddress = environment === "development" ? "http://172.16.8.207" : `${protocol}//${hostname}`
const secondaryServerAddress = environment === "development" ? "http://172.16.8.157" : `${protocol}//${hostname}`
const streamSocketAddress = environment === "development" ? "ws://127.0.0.1" : `ws://${hostname}`

const serverPort = environment === "development" ? 5030 : 5030


export const API_CONFIG = {
  hostname,
  baseServerAddress,
  serverPort,
  faceDetection: `${baseServerAddress}:${serverPort}`,
  plateDetection: `${baseServerAddress}:${serverPort}`,
  websocket: `${socketAddress}:15674/ws`,
  streamSocketAddress,
}

export const ONTOLOGY = {
  alertManagementAddress: `${baseServerAddress}:2600`,
  convertAddress: `${baseServerAddress}:6060`,
  searchAddress: `${baseServerAddress}`,
  datasetAddress: `${baseServerAddress}:2500`,
  profileManagementAddress: `${baseServerAddress}`,
  targetListAddress: `${baseServerAddress}`,
  usersManagementAddress: `${baseServerAddress}`,
  uploadFiles: `${baseServerAddress}:6010`,
  sqlProcess: `${baseServerAddress}:8086`,
  detectLang: `${baseServerAddress}/api/ai`,
  translate: `${baseServerAddress}/api/ai`,
  summarize: `${baseServerAddress}/api/ai`,
  tagCloud: `${baseServerAddress}/api/ai`,
  authentication: `${baseServerAddress}`,
  layersService: `${baseServerAddress}`,
  regionManagement: `${baseServerAddress}/api/search`,
  websocket: `${socketAddress}:15674`,
  dashboard: `${baseServerAddress}`,
  workProfile: `${baseServerAddress}/api/search/workProfile`
}
