import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/v1/auth/authenticate", {
        email,
        password,
      });
      const { access_token } = response.data;

      return access_token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ firstName, lastName, mail, passkey }, { rejectWithValue }) => {
    try {
      await apiClient.post("/api/v1/auth/register", {
        firstName,
        lastName,
        mail,
        passkey,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.error.message = "Invalid credentials";
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.error.message = "Failed to register user";
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.error.message = "Failed to fetch user";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
