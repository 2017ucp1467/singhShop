import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { detailLoading: true, orderList: [] };

export const createOrder = createAsyncThunk(
  "order/create",
  async (data, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      console.log("data sent to backend", data);
      const response = await axios.post("/order/add/", data, { headers });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "myOrders",
  async (arg, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get(`/order/myorders/`, { headers });
      console.log("response for orderList", response);
      return response.data;
    } catch (err) {
      console.log("error occured in api call");
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const getOrderDetail = createAsyncThunk(
  "orderInfo",
  async (id, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get(`/order/${id}`, { headers });
      console.log("response for orderDetail", response);
      return response.data;
    } catch (err) {
      console.log("error occured in api call");
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const payOrder = createAsyncThunk(
  "order/pay",
  async ({ id, paymentResult }, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.put(`/order/${id}/pay/`, paymentResult, {
        headers,
      });
      console.log("response after payment", response);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const getAdminOrderList = createAsyncThunk(
  "allOrders",
  async (arg, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get("/order/all/", {
        headers,
      });
      console.log("response for all orders", response.data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      return {};
    },
  },
  extraReducers: {
    [createOrder.pending]: (state) => {
      state.isLoading = true;
    },
    [createOrder.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.orderDetail = action.payload;
      state.success = true;
    },
    [createOrder.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.orderDetail = null;
      state.success = false;
    },
    [getOrderDetail.pending]: (state) => {
      state.detailLoading = true;
    },
    [getOrderDetail.fulfilled]: (state, action) => {
      state.detailLoading = false;
      state.orderDetail = action.payload;
    },
    [getOrderDetail.rejected]: (state, action) => {
      state.detailLoading = false;
      state.error = action.payload;
      state.orderDetail = true;
    },
    [payOrder.pending]: (state) => {
      state.isLoading = true;
    },
    [payOrder.success]: (state) => {
      state.isLoading = false;
      state.paymentSuccess = true;
    },
    [payOrder.rejected]: (state, action) => {
      state.isLoading = false;
      state.paymentSuccess = false;
      state.paymentError = action.payload;
    },
    [getOrderList.pending]: (state) => {
      state.isLoading = true;
    },
    [getOrderList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.orderList = action.payload;
    },
    [getOrderList.rejected]: (state, action) => {
      state.isLoading = false;
      state.orderList = null;
      state.error = action.payload;
    },
    [getAdminOrderList.pending]: (state) => {
      state.isLoading = true;
    },
    [getAdminOrderList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.orderList = action.payload;
    },
    [getAdminOrderList.rejected]: (state, action) => {
      state.isLoading = false;
      state.orderList = null;
      state.error = action.payload;
    },
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
