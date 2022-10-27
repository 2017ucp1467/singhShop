import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  topProducts: [],
};

export const getTopProducts = createAsyncThunk(
  "getTopProducts",
  async (thunkAPI) => {
    try {
      const response = await axios.get("/api/products/top/");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState,
  extraReducers: {
    [getTopProducts.pending]: (state) => {
      state.loading = true;
    },
    [getTopProducts.fulfilled]: (state, action) => {
      state.loading = false;
      state.topProducts = action.payload;
    },
    [getTopProducts.rejected]: (state, action) => {
      state.loading = false;
      state.carouselError = action.payload;
    },
  },
});

export default carouselSlice.reducer
