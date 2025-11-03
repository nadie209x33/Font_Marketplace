import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../services/cartService";

// Async Thunks
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue({}); // Cart is empty, not an error
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const createCartActionThunk = (type, serviceCall) => {
  return createAsyncThunk(
    type,
    async (payload, { dispatch, rejectWithValue }) => {
      try {
        await serviceCall(payload);
        dispatch(getCart());
      } catch (error) {
        if (
          type === "cart/applyCoupon" &&
          error.response &&
          error.response.status === 500
        ) {
          return rejectWithValue({
            message: "El cupón no es válido o ha expirado.",
          });
        }
        return rejectWithValue(error.response.data);
      }
    },
  );
};

export const addToCart = createCartActionThunk("cart/addToCart", (payload) =>
  cartService.addToCart(payload.productId, payload.quantity),
);
export const updateCartItem = createCartActionThunk(
  "cart/updateCartItem",
  (payload) => cartService.updateCartItem(payload.itemId, payload.quantity),
);
export const removeFromCart = createCartActionThunk(
  "cart/removeFromCart",
  (itemId) => cartService.removeFromCart(itemId),
);
export const clearCart = createCartActionThunk("cart/clearCart", () =>
  cartService.clearCart(),
);
export const applyCoupon = createCartActionThunk(
  "cart/applyCoupon",
  (couponCode) => cartService.applyCoupon(couponCode),
);
export const removeCoupon = createCartActionThunk("cart/removeCoupon", () =>
  cartService.removeCoupon(),
);

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const cartActions = [
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
];

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

    cartActions.forEach((action) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export default cartSlice.reducer;
