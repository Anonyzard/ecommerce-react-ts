import { configureStore } from "@reduxjs/toolkit";
import { storeApi } from "./reducers/storeApi";
import { contactsApi } from "./reducers/contactsApi";
import { tokenSlice } from "./reducers/tokenSlice";

export const store = configureStore({
    reducer: {
        [storeApi.reducerPath]: storeApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        token: tokenSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(storeApi.middleware, contactsApi.middleware),
});