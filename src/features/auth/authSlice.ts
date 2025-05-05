import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

interface User {
  id: number;
  email: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );
      const { access_token, user } = response.data.data;

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", access_token);

      // Axios header'ına token'ı ekle
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      return { access_token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Giriş başarısız");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: { email: string; password: string; name: string }) => {
    const response = await axiosInstance.post("/auth/register", userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  // Token'ı localStorage'dan sil
  localStorage.removeItem("token");

  // Axios header'ından token'ı kaldır
  delete axiosInstance.defaults.headers.common["Authorization"];
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Giriş başarısız";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Kayıt başarısız";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
