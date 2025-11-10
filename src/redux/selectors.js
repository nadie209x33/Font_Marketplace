import { createSelector } from '@reduxjs/toolkit';

const selectAuthLoading = state => state.auth.loading;
const selectCartLoading = state => state.cart.loading;
const selectCategoryLoading = state => state.category.loading;
const selectProductLoading = state => state.product.loading;

export const selectIsLoading = createSelector(
  [selectAuthLoading, selectCartLoading, selectCategoryLoading, selectProductLoading],
  (authLoading, cartLoading, categoryLoading, productLoading) =>
    authLoading || cartLoading || categoryLoading || productLoading
);
