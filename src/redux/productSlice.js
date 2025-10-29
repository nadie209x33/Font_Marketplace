import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productService";

// Thunks
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ filters, pagination }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({
        ...filters,
        page: pagination.page,
        size: pagination.size,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchProductData = createAsyncThunk(
  "product/fetchProductData",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        return rejectWithValue("Product not found");
      }

      let breadcrumbs = [];
      if (product.categoryId) {
        const path = [];
        let currentCategoryId = product.categoryId;
        while (currentCategoryId && currentCategoryId !== 0) {
          const category =
            await productService.getCategoryById(currentCategoryId);
          path.unshift(category);
          currentCategoryId = category.parentId;
        }
        breadcrumbs = path;
      }

      const relatedProducts = []; // Logic for related products can be complex, keeping it simple for now

      return { product, breadcrumbs, relatedProducts };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  products: [],
  pagination: { page: 0, size: 20, totalPages: 1 },
  selectedProductData: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product Data
      .addCase(fetchProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProductData = action.payload;
      })
      .addCase(fetchProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
