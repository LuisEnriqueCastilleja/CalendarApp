import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlice";
import { calendarSlice } from "./calendar/calendarSlice";
import { authSlice } from "./auth/authSlice";

export const store = configureStore({
    //Para configurar el middleware
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            //Es para que no revise si las fechas se pueden serializar 
            serializableCheck: false,
        }),
    reducer: {
        ui: uiSlice.reducer,
        calendar: calendarSlice.reducer,
        auth: authSlice.reducer,
    }
})
