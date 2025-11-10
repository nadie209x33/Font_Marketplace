import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import apiClient from "../services/apiClient";
import AuthImage from "../components/common/AuthImage";

// A recursive component to render category options
const CategoryOptions = ({ categories, level = 0 }) => {
  return categories.map((category) => (
    <React.Fragment key={category.id}>
      <option value={category.id}>
        {`${"--".repeat(level)} ${category.name}`}
      </option>
      {category.children && category.children.length > 0 && (
        <CategoryOptions categories={category.children} level={level + 1} />
      )}
    </React.Fragment>
  ));
};

const ProductFormModal = ({ show, onHide, product, onSave }) => {
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageIds, setImageIds] = useState([]);

  // State for the new category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParentId, setNewCategoryParentId] = useState(0);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/v1/categories/tree");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Error al cargar las categorías.");
    }
  };

  useEffect(() => {
    if (show) {
      fetchCategories();
    }

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        categoryId: product.categoryId || 0,
        stock: product.stock || 0,
        active: product.active !== undefined ? product.active : true,
      });
      setImageIds(product.imageIds || []);
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
        stock: 0,
        active: true,
      });
      setImageIds([]);
    }
  }, [product, show]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = name === "categoryId" ? parseInt(value, 10) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : val,
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      const payload = {
        name: newCategoryName,
        parentId: newCategoryParentId ? parseInt(newCategoryParentId, 10) : 0,
      };
      const response = await apiClient.post("/api/v1/categories", payload);

      // Reset and close the category modal
      setShowCategoryModal(false);
      setNewCategoryName("");
      setNewCategoryParentId(0);

      // Refresh categories and select the new one
      await fetchCategories();
      setFormData((prev) => ({ ...prev, categoryId: response.data.id }));
    } catch (err) {
      setCategoryError("Error al crear la categoría.");
      console.error(err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?"))
      return;

    try {
      await apiClient.delete("/api/v1/images", { data: { id: imageId } });
      setImageIds((currentIds) => currentIds.filter((id) => id !== imageId));
    } catch (err) {
      console.error("Failed to delete image", err);
      setError("Error al eliminar la imagen. Por favor, inténtalo de nuevo.");
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

    setImageIds(newImageIds);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setError("Error al guardar el producto. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
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
                onClick={() => setShowCategoryModal(true)}
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
        onHide={() => setShowCategoryModal(false)}
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
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría Padre (opcional)</Form.Label>
              <Form.Select
                value={newCategoryParentId}
                onChange={(e) => setNewCategoryParentId(e.target.value)}
              >
                <option value="0">Ninguna (Categoría Raíz)</option>
                <CategoryOptions categories={categories} />
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCategoryModal(false)}
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
