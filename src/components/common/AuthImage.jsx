import React, { useEffect } from "react";
import { productService } from "../../services/productService";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setComponentState,
  clearComponentState,
  setInitialComponentState,
} from "../../redux/uiSlice";

const AuthImage = ({ imageId, alt, ...props }) => {
  const dispatch = useDispatch();
  const { imageUrl, loading, error } =
    useSelector((state) => state.ui.componentState[`AuthImage_${imageId}`]) ||
    {};

  useEffect(() => {
    dispatch(
      setInitialComponentState({
        component: `AuthImage_${imageId}`,
        initialState: {
          imageUrl: null,
          loading: true,
          error: false,
        },
      }),
    );
    return () => {
      dispatch(clearComponentState({ component: `AuthImage_${imageId}` }));
    };
  }, [dispatch, imageId]);

  useEffect(() => {
    if (!imageId) {
      dispatch(
        setComponentState({
          component: `AuthImage_${imageId}`,
          key: "loading",
          value: false,
        }),
      );
      dispatch(
        setComponentState({
          component: `AuthImage_${imageId}`,
          key: "error",
          value: true,
        }),
      );
      return;
    }

    let objectUrl = null;

    const fetchImage = async () => {
      try {
        dispatch(
          setComponentState({
            component: `AuthImage_${imageId}`,
            key: "loading",
            value: true,
          }),
        );
        dispatch(
          setComponentState({
            component: `AuthImage_${imageId}`,
            key: "error",
            value: false,
          }),
        );
        const blob = await productService.getImageBlob(imageId);
        objectUrl = URL.createObjectURL(blob);
        dispatch(
          setComponentState({
            component: `AuthImage_${imageId}`,
            key: "imageUrl",
            value: objectUrl,
          }),
        );
      } catch (e) {
        console.error("Failed to fetch auth image", e);
        dispatch(
          setComponentState({
            component: `AuthImage_${imageId}`,
            key: "error",
            value: true,
          }),
        );
      } finally {
        dispatch(
          setComponentState({
            component: `AuthImage_${imageId}`,
            key: "loading",
            value: false,
          }),
        );
      }
    };

    fetchImage();

    // Función de limpieza para revocar la URL y liberar memoria
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId, dispatch]);

  if (loading) {
    return (
      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
    );
  }

  if (error || !imageUrl) {
    return (
      <img
        src="https://placehold.co/600x400/E9ECEF/495057?text=Error"
        alt="Error al cargar imagen"
        {...props}
      />
    );
  }

  return <img src={imageUrl} alt={alt} {...props} />;
};

export default AuthImage;
