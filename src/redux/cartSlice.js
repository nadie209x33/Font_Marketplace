import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../services/cartService";

// Async Thunks
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await cartService.getCart(token);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // Cart is empty, not an error
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const createCartActionThunk = (type, serviceCall) => {
  return createAsyncThunk(
    type,
    async (payload, { dispatch, getState, rejectWithValue }) => {
      try {
        const token = getState().auth.token;
        await serviceCall(token, payload);
        dispatch(getCart());
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    },
  );
};

export const addToCart = createCartActionThunk(
  "cart/addToCart",
  (token, payload) =>
    cartService.addToCart(token, payload.productId, payload.quantity),
);
export const updateCartItem = createCartActionThunk(
  "cart/updateCartItem",
  (token, payload) =>
    cartService.updateCartItem(token, payload.itemId, payload.quantity),
);
export const removeFromCart = createCartActionThunk(
  "cart/removeFromCart",
  (token, itemId) => cartService.removeFromCart(token, itemId),
);
export const clearCart = createCartActionThunk("cart/clearCart", (token) =>
  cartService.clearCart(token),
);
export const applyCoupon = createCartActionThunk(
  "cart/applyCoupon",
  (token, couponCode) => cartService.applyCoupon(token, couponCode),
);
export const removeCoupon = createCartActionThunk(
  "cart/removeCoupon",
  (token) => cartService.removeCoupon(token),
);

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Optionally handle pending/rejected states for other actions
  },
});

export default cartSlice.reducer;
