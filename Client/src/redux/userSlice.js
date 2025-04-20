import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
    name:"user",
    initialState:{
        user:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        }
    }
})

export const {setUser} = userslice.actions;
export default userslice.reducer;