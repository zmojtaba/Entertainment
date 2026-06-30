import { configureStore } from "@reduxjs/toolkit"
import createReducer from "./rootReducer"

// if (process.env.NODE_ENV === "development" && module.hot) {
//   (module as any).hot.accept("./rootReducer", () => {
//     const newRootReducer = require("./rootReducer").default
//     store.replaceReducer(newRootReducer.createReducer())
//   })
// }

const middlewares: any = []

// if (process.env.NODE_ENV === "development") {
//   const { createLogger } = require(`redux-logger`)
//   const logger = createLogger({
//     collapsed: (getState, action, logEntry) => !logEntry.error
//   })
  
//   middlewares.push(logger)
// }

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(middlewares),
    devTools: process.env.NODE_ENV === "development"
  })
  
  ;(store as any).asyncReducers = {}
  
  export const injectReducer = (key, reducer) => {
    if ((store as any).asyncReducers[key]) {
      return false
    }
    ;(store as any).asyncReducers[key] = reducer
    store.replaceReducer(createReducer((store as any).asyncReducers))
    return store
  }
  
  export default store
  
  export type RootState = ReturnType<typeof store.getState>
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch
