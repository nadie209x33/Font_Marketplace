import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import orderReducer from "./orderSlice";
import addressReducer from "./addressSlice";
import couponReducer from "./couponSlice";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";
import { setupInterceptors } from "../services/axiosConfig";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  categories: categoryReducer,
  order: orderReducer,
  address: addressReducer,
  coupons: couponReducer,
  users: userReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

setupInterceptors(store);
