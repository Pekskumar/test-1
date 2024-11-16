import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Token: localStorage.getItem("Token") ? localStorage.getItem("Token") : null,
  TransactionList: [],
  UserInfo: localStorage.getItem("UserInfo")
    ? JSON.parse(localStorage.getItem("UserInfo"))
    : null,
};

const UserInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userToken: (state, action) => {
      state.Token = action.payload;
      localStorage.setItem("Token", action.payload);
    },
    userInfo: (state, action) => {
      state.UserInfo = action.payload;
      localStorage.setItem("UserInfo", JSON.stringify(action.payload));
    },
    transactionList: (state, action) => {
      state.TransactionList = action.payload;
    },
  },
});
export const { userToken, userInfo, transactionList } = UserInfoSlice.actions;
export default UserInfoSlice.reducer;
