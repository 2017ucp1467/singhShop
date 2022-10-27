import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getProductList } from "./productListSlice";

const initialState = {
  product: {},
  isLoading: true,
  Success: false,
  reviewSuccess: false,
  reviewLoading: false,
};

export const getProductDetail = createAsyncThunk(
  "product/getProductDetail",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const createProduct = createAsyncThunk(
  "createProduct",
  async (product, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const formdata = new FormData();
      formdata.append("image", product.image);
      formdata.append("name", product.name);
      formdata.append("brand", product.brand);
      formdata.append("category", product.category);
      formdata.append("price", product.price);
      formdata.append("countInStock", product.countInStock);
      const response = await axios.post("/api/products/create/", formdata, {
        headers,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const updateProductDetail = createAsyncThunk(
  "updateProduct",
  async (data, thunkAPI) => {
    console.log("data :", data);
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.put(
        `/api/products/update/${data.id}/`,
        data,
        {
          headers,
        }
      );
      thunkAPI.dispatch(getProductList());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (id, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.delete(`/api/products/delete/${id}/`, {
        headers,
      });
      thunkAPI.dispatch(getProductList());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createProductReview = createAsyncThunk(
  "createProductReview",
  async (data, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.post(
        `/api/products/${data["id"]}/reviews/`,
        data,
        { headers }
      );
      thunkAPI.dispatch(getProductDetail());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.product = {};
    },
  },
  extraReducers: {
    [getProductDetail.pending]: (state) => {
      state.isLoading = true;
    },
    [getProductDetail.fulfilled]: (state, action) => {
      state.product = action.payload;
      state.isLoading = false;
    },
    [getProductDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [updateProductDetail.pending]: (state) => {
      state.isLoading = true;
    },
    [updateProductDetail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.Success = true;
    },
    [updateProductDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.Success = false;
      state.error = action.payload;
    },
    [deleteProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.Success = true;
    },
    [deleteProduct.rejected]: (state, action) => {
      state.isLoading = false;
      state.Success = false;
      state.error = action.payload;
    },
    [createProductReview.pending]: (state) => {
      state.reviewLoading = true;
    },
    [createProductReview.fulfilled]: (state) => {
      state.reviewLoading = false;
      state.reviewSuccess = true;
    },
    [createProductReview.rejected]: (state, action) => {
      state.reviewLoading = false;
      state.reviewSuccess = false;
      state.reviewError = action.payload;
    },
  },
});

export const { clearProductDetail } = productDetailSlice.actions;

export default productDetailSlice.reducer;
