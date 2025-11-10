import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: {},
  },
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const { setLoading } = statusSlice.actions;

export const selectLoading = (state, key) => !!state.status.loading[key];

export default statusSlice.reducer;
