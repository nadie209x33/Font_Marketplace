import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressService } from "../services/addressService";

// Thunks
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { dispatch, rejectWithValue }) => {
    try {
      await addressService.createAddress(addressData);
      dispatch(fetchAddresses());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, addressData }, { dispatch, rejectWithValue }) => {
    try {
      await addressService.updateAddress(addressId, addressData);
      dispatch(fetchAddresses());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { dispatch, rejectWithValue }) => {
    try {
      await addressService.deleteAddress(addressId);
      dispatch(fetchAddresses());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const genericCases = (action) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      });

    [fetchAddresses, createAddress, updateAddress, deleteAddress].forEach(genericCases);
  },
});

export default addressSlice.reducer;
