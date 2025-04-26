import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const adminSlice= createSlice({
    name:"admin",
    initialState: {
        adminInfo:Cookies.get("adminInfo") ? JSON.parse(Cookies.get("adminInfo")) : {}
    },
    reducers:{
        adminDataStore: (state,action)=>{
            state.adminInfo=action.payload
            Cookies.set("adminInfo",JSON.stringify(state.adminInfo))
        },
        logOut: (state,action)=>{
            state.adminInfo={}
            Cookies.remove("adminInfo")
        }
    }
})

export const {adminDataStore,logOut}=adminSlice.actions

export default adminSlice.reducer