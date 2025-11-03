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

export const fetchProductPageData = createAsyncThunk(
  "product/fetchProductPageData",
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

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      dispatch(fetchProducts({ pagination: { page: 0, size: 20 } }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  products: [],
  pagination: { page: 0, size: 20, totalPages: 1 },
  productPageData: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
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
      .addCase(fetchProductPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.productPageData = action.payload;
      })
      .addCase(fetchProductPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
