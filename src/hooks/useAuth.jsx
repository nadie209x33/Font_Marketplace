import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser, fetchUser, logout } from "../redux/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  const login = (email, password) => {
    return dispatch(loginUser({ email, password }));
  };

  const register = (firstName, lastName, mail, passkey) => {
    return dispatch(registerUser({ firstName, lastName, mail, passkey }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout: logoutUser,
    register,
  };
};
