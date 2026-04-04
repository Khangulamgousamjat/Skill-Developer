import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.role = action.payload.user.role;
      state.token = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
});

export const { loginSuccess, logoutSuccess, updateUser } = authSlice.actions;
export default authSlice.reducer;
