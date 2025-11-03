import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { couponService } from "../services/couponService";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await couponService.getCoupons({ page, size });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponData, { dispatch, rejectWithValue }) => {
    try {
      await couponService.createCoupon(couponData);
      dispatch(fetchCoupons());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, couponData }, { dispatch, rejectWithValue }) => {
    try {
      await couponService.updateCoupon(id, couponData);
      dispatch(fetchCoupons());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  coupons: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.cupones;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
