import { useSelector, useDispatch } from "react-redux";
import {
  getCart,
  addToCart as addToCartAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
} from "../redux/cartSlice";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  const addToCart = (productId, quantity) => {
    return dispatch(addToCartAction({ productId, quantity }));
  };

  const updateCartItem = (itemId, quantity) => {
    return dispatch(updateCartItemAction({ itemId, quantity }));
  };

  const removeFromCart = (itemId) => {
    return dispatch(removeFromCartAction(itemId));
  };

  const clearCart = () => {
    return dispatch(clearCartAction());
  };

  const applyCoupon = (couponCode) => {
    return dispatch(applyCouponAction(couponCode));
  };

  const removeCoupon = () => {
    return dispatch(removeCouponAction());
  };

  return {
    cart,
    items: cart?.items || [],
    loading,
    error,
    getCart: () => dispatch(getCart()),
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
};
