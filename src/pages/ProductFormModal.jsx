import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productService } from "../services/productService";
import { fetchCategories } from "../redux/categorySlice";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import AuthImage from "../components/common/AuthImage";
import CategoryOptions from "../components/common/CategoryOptions";
import apiClient from "../services/apiClient";
import {
  setComponentState,
  clearComponentState,
  setInitialComponentState,
} from "../redux/uiSlice";

const ProductFormModal = ({ product, show, onHide, onSave }) => {
  const dispatch = useDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const componentId = React.useId();
  const {
    formData = {
      name: "",
      description: "",
      categoryId: "",
      price: "",
      stock: "",
      active: true,
    },
    images,
    imageIds = [],
    loading,
    error,
    showCategoryModal,
    newCategoryName,
    newCategoryParentId,
    categoryLoading,
    categoryError,
  } = useSelector(
    (state) => state.ui.componentState[`ProductFormModal_${componentId}`],
  ) || {};

  React.useEffect(() => {
    dispatch(
      setInitialComponentState({
        component: `ProductFormModal_${componentId}`,
        initialState: {
          formData: {},
          images: [],
          imageIds: [],
          loading: false,
          error: null,
          showCategoryModal: false,
          newCategoryName: "",
          newCategoryParentId: 0,
          categoryLoading: false,
          categoryError: null,
        },
      }),
    );
    return () => {
      dispatch(
        clearComponentState({ component: `ProductFormModal_${componentId}` }),
      );
    };
  }, [dispatch, componentId]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "formData",
          value: {
            name: product.name || "",
            description: product.description || "",
            categoryId: product.categoryId || "",
            price: product.price || "",
            stock: product.stock || "",
            active: product.active || false,
          },
        }),
      );
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "imageIds",
          value: product.imageIds || [],
        }),
      );
    } else {
      // Reset form for new product
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "formData",
          value: {
            name: "",
            description: "",
            categoryId: "",
            price: "",
            stock: "",
            active: true,
          },
        }),
      );
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "imageIds",
          value: [],
        }),
      );
    }
  }, [product, dispatch, componentId]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = name === "categoryId" ? parseInt(value, 10) : value;
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "formData",
        value: { ...formData, [name]: type === "checkbox" ? checked : val },
      }),
    );
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "categoryLoading",
        value: true,
      }),
    );
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "categoryError",
        value: null,
      }),
    );
    try {
      const payload = {
        name: newCategoryName,
        parentId: newCategoryParentId ? parseInt(newCategoryParentId, 10) : 0,
      };
      const response = await apiClient.post("/api/v1/categories", payload);

      // Reset and close the category modal
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "showCategoryModal",
          value: false,
        }),
      );
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "newCategoryName",
          value: "",
        }),
      );
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "newCategoryParentId",
          value: 0,
        }),
      );

      // Refresh categories and select the new one
      await dispatch(fetchCategories());
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "formData",
          value: { ...formData, categoryId: response.data.id },
        }),
      );
    } catch (err) {
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "categoryError",
          value: "Error al crear la categoría.",
        }),
      );
      console.error(err);
    } finally {
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "categoryLoading",
          value: false,
        }),
      );
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?"))
      return;

    try {
      await apiClient.delete("/api/v1/images", { data: { id: imageId } });
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "imageIds",
          value: imageIds.filter((id) => id !== imageId),
        }),
      );
    } catch (err) {
      console.error("Failed to delete image", err);
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "error",
          value: "Error al eliminar la imagen. Por favor, inténtalo de nuevo.",
        }),
      );
    }
  };

  const handleMoveImage = (index, direction) => {
    const newImageIds = [...imageIds];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newImageIds.length) return;

    // Swap elements
    [newImageIds[index], newImageIds[newIndex]] = [
      newImageIds[newIndex],
      newImageIds[index],
    ];

    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "imageIds",
        value: newImageIds,
      }),
    );
  };

  const handleImageChange = (e) => {
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "images",
        value: [...e.target.files],
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "loading",
        value: true,
      }),
    );
    dispatch(
      setComponentState({
        component: `ProductFormModal_${componentId}`,
        key: "error",
        value: null,
      }),
    );

    try {
      // Step 1: Create or Update the product details
      let productResponse;
      if (product) {
        // Create payload for update, including the order of existing images
        const updatePayload = { ...formData, imageIds };

        // Update existing product
        productResponse = await apiClient.put(
          `/api/v1/products/${product.id}`,
          updatePayload,
        );
      } else {
        // Create new product
        productResponse = await apiClient.post("/api/v1/products", formData);
      }

      const productId = productResponse.data.id;

      // Step 2: Upload images (if any)
      if (images.length > 0) {
        const imageUploadPromises = [];
        // Upload in reverse order as requested
        for (let i = images.length - 1; i >= 0; i--) {
          const imageFile = images[i];
          const imageFormData = new FormData();
          imageFormData.append("file", imageFile);
          imageFormData.append(
            "meta",
            JSON.stringify({ productId, altText: formData.name }),
          );

          imageUploadPromises.push(
            apiClient.post("/api/v1/images/upload", imageFormData),
          );
        }
        await Promise.all(imageUploadPromises);
      }

      onSave(); // Notify parent to refresh and close modal
    } catch (err) {
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "error",
          value: "Error al guardar el producto. Por favor, inténtalo de nuevo.",
        }),
      );
      console.error(err);
    } finally {
      dispatch(
        setComponentState({
          component: `ProductFormModal_${componentId}`,
          key: "loading",
          value: false,
        }),
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? "Editar Producto" : "Crear Producto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <div className="d-flex">
              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                <CategoryOptions categories={categories} />
              </Form.Select>
              <Button
                variant="outline-secondary"
                className="ms-2"
                onClick={() =>
                  dispatch(
                    setComponentState({
                      component: `ProductFormModal_${componentId}`,
                      key: "showCategoryModal",
                      value: true,
                    }),
                  )
                }
              >
                Nueva
              </Button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="Activo"
              name="active"
              checked={formData.active}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imágenes</Form.Label>
            <Form.Control type="file" multiple onChange={handleImageChange} />
          </Form.Group>

          {imageIds.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Imágenes Existentes</Form.Label>
              <div className="d-flex flex-wrap">
                {imageIds.map((id, index) => (
                  <div
                    key={id}
                    className="border p-2 m-1 text-center"
                    style={{ width: "150px" }}
                  >
                    <AuthImage
                      imageId={id}
                      alt={`Imagen del producto ${index + 1}`}
                      className="img-fluid mb-2"
                    />
                    <div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteImage(id)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="ms-1"
                        onClick={() => handleMoveImage(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="ms-1"
                        onClick={() => handleMoveImage(index, "down")}
                        disabled={index === imageIds.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </Modal.Footer>
      </Form>

      {/* Category Creation Modal */}
      <Modal
        show={showCategoryModal}
        onHide={() =>
          dispatch(
            setComponentState({
              component: `ProductFormModal_${componentId}`,
              key: "showCategoryModal",
              value: false,
            }),
          )
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCategory}>
          <Modal.Body>
            {categoryError && <Alert variant="danger">{categoryError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryName}
                onChange={(e) =>
                  dispatch(
                    setComponentState({
                      component: `ProductFormModal_${componentId}`,
                      key: "newCategoryName",
                      value: e.target.value,
                    }),
                  )
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría Padre (opcional)</Form.Label>
              <Form.Select
                value={newCategoryParentId}
                onChange={(e) =>
                  dispatch(
                    setComponentState({
                      component: `ProductFormModal_${componentId}`,
                      key: "newCategoryParentId",
                      value: e.target.value,
                    }),
                  )
                }
              >
                <option value="0">Ninguna (Categoría Raíz)</option>
                <CategoryOptions categories={categories} />
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  setComponentState({
                    component: `ProductFormModal_${componentId}`,
                    key: "showCategoryModal",
                    value: false,
                  }),
                )
              }
              disabled={categoryLoading}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={categoryLoading}>
              {categoryLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Crear Categoría"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Modal>
  );
};

export default ProductFormModal;
