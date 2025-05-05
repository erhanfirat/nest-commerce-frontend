import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin" | "seller";
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await axiosInstance.get<User[]>("/users");
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: number) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData: Omit<User, "id">) => {
    const response = await axiosInstance.post<User>("/users", userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: number; data: Partial<User> }) => {
    const response = await axiosInstance.patch<User>(`/users/${id}`, data);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number) => {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Kullanıcılar yüklenemedi";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
