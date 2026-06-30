import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface initialStateType {
    imageUrl: string
}

const initialState: initialStateType = { imageUrl: '' }

export const imageEnhancerSlice = createSlice({
    name: 'imageEnhancer',
    initialState,
    reducers: {
        setImageUrl: (state, action: PayloadAction<initialStateType>) => {
            state.imageUrl = action.payload.imageUrl
        }
    }
})
export const { setImageUrl } = imageEnhancerSlice.actions
export default imageEnhancerSlice.reducer


//     icon: string[],
//     title: string,

//   }

//   const initialState: initialStateType = { icon: [], title: "" }

// export const pageSlice = createSlice({
//     name: "pageDetails",
//     initialState,
//     reducers: {
//         updateAppPage: (state, action: PayloadAction<initialStateType>) => {
//             return {
//                 ...state,
//                 icon: action.payload.icon,
//                 title: action.payload.title
//             }
//         }
//     }
// })

// Action creators are generated for each case reducer function
// export const { updateAppPage } = pageSlice.actions
// export default pageSlice.reducer