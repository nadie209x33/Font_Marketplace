import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, ButtonGroup, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import apiClient from '../services/apiClient';
import ProductFormModal from './ProductFormModal';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/v1/admin/products/all?page=${pageNum}&size=20`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleShowDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await apiClient.delete(`/api/v1/products/${productToDelete.id}`);
      fetchProducts(page); // Refresh the list
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleShowCreateModal = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleShowEditModal = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleSaveProduct = () => {
    setShowFormModal(false);
    fetchProducts(page); // Re-fetch products to show the new/updated one
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administrar Productos</h1>
        <div>
          <Button variant="primary" className="me-2" onClick={handleShowCreateModal}>Crear Nuevo Producto</Button>
          <LinkContainer to="/admin">
            <Button variant="secondary">Volver al Menú de Administrador</Button>
          </LinkContainer>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Badge bg={product.active ? 'success' : 'secondary'}>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      {product.active && (
                        <LinkContainer to={`/product/${product.id}`}>
                          <Button variant="outline-info" size="sm">Ver</Button>
                        </LinkContainer>
                      )}
                      <Button variant="outline-primary" size="sm" onClick={() => handleShowEditModal(product)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleShowDeleteModal(product)}>Eliminar</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center">
            <ButtonGroup>
              <Button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                Anterior
              </Button>
              <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                Siguiente
              </Button>
            </ButtonGroup>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar el producto "{productToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Product Form Modal */}
      <ProductFormModal 
        show={showFormModal} 
        onHide={() => setShowFormModal(false)} 
        product={editingProduct} 
        onSave={handleSaveProduct} 
      />
    </Container>
  );
};

export default AdminProductsPage;
