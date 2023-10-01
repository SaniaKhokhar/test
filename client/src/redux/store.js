import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { userSlice } from "./features/userSlice";

const rootReducer = combineReducers({
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
})

export default configureStore({
    reducer: rootReducer,
})