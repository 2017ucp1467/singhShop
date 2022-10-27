import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { updateUserInfo } from "./userSlice";

const initialState = {};

export const getUserDetail = createAsyncThunk(
  "user/profile",
  async (arg, thunkAPI) => {
    //its important to have arg param even if we don't need to pass any arguments to async function but we want to have access to thunkAPI object
    try {
      const {
        user: { userInfo },
      } = thunkAPI.getState();
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get("/users/profile", { headers });
      return response.data;
    } catch (err) {
      console.log("error", err);
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const updateUserDetail = createAsyncThunk(
  "user/updateProfile",
  async (userDetail, thunkAPI) => {
    try {
      const {
        user: { userInfo },
      } = thunkAPI.getState();
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.put("/users/profile/update", userDetail, {
        headers,
      });
      thunkAPI.dispatch(updateUserInfo(response.data));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const userDetailSlice = createSlice({
  name: "userDetail",
  initialState,
  extraReducers: {
    [getUserDetail.pending]: (state) => {
      state.isLoading = true;
    },
    [getUserDetail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userDetail = action.payload;
      localStorage.setItem("userDetail", JSON.stringify(state.userDetail));
    },
    [getUserDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.userDetail = null;
      state.error = action.payload;
    },
    [updateUserDetail.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUserDetail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userDetail = action.payload;
      state.success = true;
      localStorage.setItem("userDetail", JSON.stringify(state.userDetail));
    },
    [updateUserDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default userDetailSlice.reducer;
