import { configureStore } from "@reduxjs/toolkit";
import  adminSlice from "./reducers/adminSlice";

export const store=configureStore({
    reducer:{
        adminReducer:adminSlice
    }
})