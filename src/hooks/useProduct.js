import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductData } from "../redux/productSlice";

export const useProduct = (productId) => {
  const dispatch = useDispatch();
  const { selectedProductData, loading, error } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductData(productId));
    }
  }, [productId, dispatch]);

  return {
    product: selectedProductData?.product,
    breadcrumbs: selectedProductData?.breadcrumbs || [],
    relatedProducts: selectedProductData?.relatedProducts || [],
    loading,
    error,
  };
};
