import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
}

interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params: PaginationParams = { page: 1, limit: 10 }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse>>(
        `/products?page=${params.page}&limit=${params.limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Ürünler yüklenirken hata oluştu:", error);
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: number) => {
    try {
      const response = await axiosInstance.get<ApiResponse<Product>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Ürün detayı yüklenirken hata oluştu:", error);
      throw error;
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: Omit<Product, "id">) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Product>>(
        "/products",
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Ürün oluşturulurken hata oluştu:", error);
      throw error;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Product>>(
        `/products/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Ürün güncellenirken hata oluştu:", error);
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.data;
        state.pagination = {
          currentPage: action.payload.data.page,
          totalPages: Math.ceil(
            action.payload.data.total / action.payload.data.limit
          ),
          totalItems: action.payload.data.total,
          itemsPerPage: action.payload.data.limit,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ürünler yüklenemedi";
        state.items = [];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload.data;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setSelectedProduct, clearSelectedProduct, setPage } =
  productSlice.actions;
export default productSlice.reducer;
