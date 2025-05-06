import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

// API çağrıları için async thunk'lar
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axiosInstance.get("/cart");
  return response.data.data;
});

export const addToCartApi = createAsyncThunk(
  "cart/addToCart",
  async (cartItem: {
    productId: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }) => {
    const response = await axiosInstance.post("/cart/add", {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    });

    return {
      ...response.data.data,
      name: cartItem.name,
      price: cartItem.price,
      image: cartItem.image,
    };
  }
);

export const clearCartApi = createAsyncThunk("cart/clearCart", async () => {
  await axiosInstance.delete("/cart");
  return [];
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        const quantityDiff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += item.price * quantityDiff;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Sepet yüklenirken bir hata oluştu";
      })
      // Add to Cart
      .addCase(addToCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Ürün sepete eklenirken bir hata oluştu";
      })
      // Clear Cart
      .addCase(clearCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartApi.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Sepet temizlenirken bir hata oluştu";
      });
  },
});

export const { updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
