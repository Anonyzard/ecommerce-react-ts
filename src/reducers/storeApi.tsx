import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Item } from "../models/item.model";
import { UserRegister, UserRequest, UserResponse } from "../models/user.model";
import { Order } from "../models/order.model";
// import { axiosClient } from "./axios";


export const storeApi = createApi({
    reducerPath: "storeApi",
    keepUnusedDataFor: 300,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000", isJsonContentType: () => true }),

    tagTypes: ["Item", "User", "Order"],
    endpoints: (builder) => ({
        items: builder.query<Item[], void>({
            query: () => "/item",
            providesTags: ["Item"],
        }),
        item: builder.query<Item, string>({
            query: (id) => `/item/${id}`,
            providesTags: ["Item"],
        }),
        user: builder.query<UserRequest, string>({
            query: (id) => `/user/${id}`,
            providesTags: ["User"],
        }),
        login: builder.mutation<UserResponse, UserRequest>({
            // anonyzard@disroot.org
            query: (user) => ({
                url: "/login",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: user,
                body: JSON.stringify({ email: user.email, password: user.password }),
            }),
            // transformResponse: (response: { data: UserResponse }, meta, arg) => response.data,
            // invalidatesTags: ["User"],
        }),
        register: builder.mutation<UserRegister, UserRequest>({
            query: (user) => ({
                url: "/register",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["User"],
        }),
        order: builder.mutation<Order, Order>({
            query: (order) => ({
                url: `/buy/${order.new_item}`,
                method: "POST",
                // body: {
                    //     completed: order.completed,
                    // },
                    // headers: [[`Authorization: Bearer ${order.user_token}`]]
                    headers: {Authorization: `Bearer ${order.user_token}`}
                }),
                invalidatesTags: ["Order"],
        }),
        buy: builder.mutation<Order, Order>({
            query: (order) => ({
                url: `/buy`,
                method: "POST",
                headers: { Authorization: `Bearer ${order.user_token}` },
                body: {
                    completed: order.completed},
                }),
                invalidatesTags: ["Order"],
        }),
        last_order: builder.query<Order, string>({
            query: (user_token) => ({
                url: "/buy",
                // headers: [[`Authorization: Bearer ${user_token}`]],
                providesTags: ["Item"],
                headers: {Authorization: `Bearer ${user_token}`},}),
        }),
                // deleteContact: builder.mutation<void, string>({
                    //     query: (id) => ({
                        //         url: `/contacts/${id}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["Contact"],
        // }),
        // updateContact: builder.mutation<void, Item>({
        //     query: ({ id, ...rest }) => ({
        //         url: `/contacts/${id}`,
        //         method: "PUT",
        //         body: rest,
        //     }),
        //     invalidatesTags: ["Contact"],
        // }),
    }),
});

export const {
    useItemsQuery,
    useItemQuery,
    useLoginMutation,
    useRegisterMutation,
    useBuyMutation,
    useOrderMutation,
    useLast_orderQuery,
    useUserQuery,
    useLazyUserQuery,
    // useAddContactMutation,
    // useDeleteContactMutation,
    // useUpdateContactMutation,
} = storeApi;