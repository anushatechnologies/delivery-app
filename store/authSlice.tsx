import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  phone: string;
  otpSent: boolean;
}

const initialState: AuthState = {
  phone: "",
  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
  },
});

export const { setPhone, setOtpSent } = authSlice.actions;

export default authSlice.reducer;