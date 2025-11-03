import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductPageData } from "../redux/productSlice";

export const useProduct = (productId) => {
  const dispatch = useDispatch();
  const { productPageData, loading, error } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductPageData(productId));
    }
  }, [productId, dispatch]);

  return {
    product: productPageData?.product,
    breadcrumbs: productPageData?.breadcrumbs || [],
    relatedProducts: productPageData?.relatedProducts || [],
    loading,
    error,
  };
};
