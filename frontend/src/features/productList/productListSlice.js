import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  isLoading: true,
};

export const getProductList = createAsyncThunk(
  "product/getProductList",
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(
        `/api/products?keyword=${params.keyword}&page=${
          params.page ? params.page : 1
        }`
      );
      console.log("product list response", response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

const productListSlice = createSlice({
  name: "productsList",
  initialState,
  extraReducers: {
    // [getProductList.pending]: (state) => {
    //   state.isLoading = true;
    // },
    [getProductList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
    [getProductList.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default productListSlice.reducer;
