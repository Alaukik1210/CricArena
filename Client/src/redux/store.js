import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../redux/userSlice"
import authSlice from "../redux/authSlice"

const store = configureStore({
    reducer:{
        user:userSlice,
        auth:authSlice
    }
})

export default store;