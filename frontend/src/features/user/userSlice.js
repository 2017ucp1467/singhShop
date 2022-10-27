import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = { userInfo: userInfoFromStorage };

export const userLogin = createAsyncThunk(
  "user/loginRequest",
  async (userCreds, thunkAPI) => {
    const { username, password } = userCreds;
    try {
      const headers = { "Content-type": "application/json" };
      const response = await axios.post(
        "/users/login/",
        { username, password },
        { headers }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const userRegister = createAsyncThunk(
  "user/register",
  async (userCreds, thunkAPI) => {
    const { email, password, name } = userCreds;
    try {
      const headers = { "Content-type": "application/json" };
      const response = await axios.post(
        "/users/register/",
        { email, password, name },
        { headers }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

const userSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    userLogout: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: {
    [userLogin.pending]: (state) => {
      return { isLoading: true };
    },
    [userLogin.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    [userLogin.rejected]: (state, action) => {
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    },
    [userRegister.pending]: (state) => {
      return { isLoading: true };
    },
    [userRegister.fulfilled]: (state, action) => {
      state.isLoading = false;

      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
    [userRegister.rejected]: (state, action) => {
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    },
  },
});

export const { userLogout, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
