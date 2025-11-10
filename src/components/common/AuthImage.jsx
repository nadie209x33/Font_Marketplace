import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { productService } from "../../services/productService";
import { Spinner } from "react-bootstrap";

const AuthImage = ({ imageId, alt, ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!imageId) {
      setLoading(false);
      setError(true);
      return;
    }

    let objectUrl = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const blob = await productService.getImageBlob(token, imageId);
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (e) {
        console.error("Failed to fetch auth image", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Función de limpieza para revocar la URL y liberar memoria
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId, token]);

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
