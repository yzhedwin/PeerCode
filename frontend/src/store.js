import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./components/auth/authSlice";
import { authApi } from "./components/services/Auth";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
