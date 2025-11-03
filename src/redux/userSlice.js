import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/admin/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.put(`/api/v1/admin/users/${id}`, userData);
      dispatch(fetchUsers());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const upgradeUser = createAsyncThunk(
  "users/upgradeUser",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/api/v1/users/${userId}/upgrade`);
      dispatch(fetchUsers());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const downgradeUser = createAsyncThunk(
  "users/downgradeUser",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post(`/api/v1/users/${userId}/downgrade`);
      dispatch(fetchUsers());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
