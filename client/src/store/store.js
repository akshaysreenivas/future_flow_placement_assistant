import { createSlice, configureStore } from "@reduxjs/toolkit"

const initialState = {
    user: null
}



const userDetailsSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload
        }
    }

})

export const { setUserDetails } = userDetailsSlice.actions




export default configureStore({
    reducer: {
        user: userDetailsSlice.reducer
    }
})