
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  componentState: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setComponentState(state, action) {
      const { component, key, value } = action.payload;
      if (!state.componentState[component]) {
        state.componentState[component] = {};
      }
      state.componentState[component][key] = value;
    },
    clearComponentState(state, action) {
      const { component } = action.payload;
      if (state.componentState[component]) {
        delete state.componentState[component];
      }
    },
    setInitialComponentState(state, action) {
        const { component, initialState } = action.payload;
        state.componentState[component] = initialState;
    }
  },
});

export const { setComponentState, clearComponentState, setInitialComponentState } = uiSlice.actions;

export default uiSlice.reducer;
