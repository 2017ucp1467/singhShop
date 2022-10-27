import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { isLoading: true };

export const getUserList = createAsyncThunk(
  "getAllUsers", //used for generating actions internally,i.e, getAllUsers/pending
  async (arg, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get("/users/", { headers });
      return response.data;
    } catch (err) {
      console.log("error occured in getUserList api call");
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.delete(`/users/delete/${id}`, { headers });
      return response.data;
    } catch (err) {
      console.log("error occured in deleteUser api call");
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);

export const getUserByAdmin = createAsyncThunk(
  "getUser",
  async (id, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      const response = await axios.get(`/users/${id}/`, { headers });
      return response.data;
    } catch (err) {
      console.log("error occured in getUser api call", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "updateUser",
  async (updateUserInfo, thunkAPI) => {
    const {
      user: { userInfo },
    } = thunkAPI.getState();
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      };
      console.log("update user data", updateUserInfo);
      const response = await axios.put(
        `/users/update/${updateUserInfo.id}/`,
        updateUserInfo,
        { headers }
      );
      return response.data;
    } catch (err) {
      console.log("error occured in updateUser api call");
      return thunkAPI.rejectWithValue(err.response.data.detail);
    }
  }
);



const adminUserSlice = createSlice({
  name: "admin", //used for generating actions internally, i.e, admin/reducername
  initialState,
  reducers: {
    clearUserList: (state) => {
      state.userList = null;
    },
  },
  extraReducers: {
    [getUserList.pending]: (state) => {
      state.isLoading = true;
    },
    [getUserList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userList = action.payload;
    },
    [getUserList.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.userList = null;
    },
    [deleteUser.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.success = true;
    },
    [deleteUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getUserByAdmin.pending]: (state) => {
      state.modalLoading = true;
    },
    [getUserByAdmin.fulfilled]: (state, action) => {
      state.modalLoading = false;
      state.userDetail = action.payload;
    },
    [getUserByAdmin.rejected]: (state, action) => {
      state.modalLoading = false;
      state.getUserError = action.payload;
      state.userDetail = null;
    }
  },
});

export const { clearUserList } = adminUserSlice.actions;

export default adminUserSlice.reducer;
