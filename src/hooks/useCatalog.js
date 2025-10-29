import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categorySlice";

const findCategoryByName = (categories, name) => {
  for (const category of categories) {
    if (category.name.toLowerCase() === name.toLowerCase()) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryByName(category.children, name);
      if (found) return found;
    }
  }
  return null;
};

export const useCatalog = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    products,
    pagination: productPagination,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.product);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.category);

  const [filters, setFilters] = useState({ q: "", categoryId: "" });
  const [pagination, setPagination] = useState({ page: 0, size: 20 });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get("category");

    if (categoryName && categories.length > 0) {
      const category = findCategoryByName(categories, categoryName);
      if (category) {
        setFilters((prev) => ({ ...prev, categoryId: category.id }));
      }
    }
  }, [location.search, categories]);

  useEffect(() => {
    dispatch(fetchProducts({ filters, pagination }));
  }, [dispatch, filters, pagination]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return {
    products,
    categories,
    loading: productsLoading || categoriesLoading,
    error: productsError || categoriesError,
    pagination: { ...pagination, totalPages: productPagination.totalPages },
    filters,
    handleFilterChange,
    handlePageChange,
  };
};
