import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/orderService";

// Thunks
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAdminOrders = createAsyncThunk(
  "order/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getAdminOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, newStatus }, { dispatch, rejectWithValue }) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      dispatch(fetchAdminOrders());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updatePaymentStatus = createAsyncThunk(
  "order/updatePaymentStatus",
  async ({ paymentId, newStatus }, { dispatch, rejectWithValue }) => {
    try {
      await orderService.updatePaymentStatus(paymentId, newStatus);
      dispatch(fetchAdminOrders());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  orders: [],
  adminOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
