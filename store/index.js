import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = { offset: 0, character: null };

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOffset(state, action) {
      state.offset = action.payload;
    },
    setCharacter(state, action) {
      state.character = action.payload;
    }
  }
});

const store = configureStore({
  reducer: { app: appSlice.reducer }
});

export const appActions = appSlice.actions;

export default store;
