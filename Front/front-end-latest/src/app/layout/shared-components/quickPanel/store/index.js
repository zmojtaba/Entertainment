import { combineReducers } from "@reduxjs/toolkit"
import data from "./dataSlice"
import state from "./stateSlice.ts"

const reducer = combineReducers({
  data,
  state
})
export default reducer
