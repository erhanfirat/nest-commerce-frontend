import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    images: string[];
  };
}

interface Order {
  id: number;
  userId: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  const response = await axiosInstance.get<Order[]>("/orders");
  return response.data;
});

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: number) => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData: { items: { productId: number; quantity: number }[] }) => {
    const response = await axiosInstance.post<Order>("/orders", orderData);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }: { id: number; status: Order["status"] }) => {
    const response = await axiosInstance.patch<Order>(`/orders/${id}`, {
      status,
    });
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Siparişler yüklenemedi";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
