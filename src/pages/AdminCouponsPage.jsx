import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { couponService } from "../services/couponService";
import CustomPagination from "../components/common/CustomPagination";

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    codigo: "",
    porcentajeDescuento: "",
    fechaExpiracion: "",
    usosMaximos: "",
  });

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const token = useSelector((state) => state.auth.token);

  const fetchCoupons = async (page = 0) => {
    try {
      setLoading(true);
      const response = await couponService.getCoupons(token, {
        page,
        size: 10,
      });
      setCoupons(response.cupones);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError("Error al cargar los cupones.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCoupons(currentPage);
    }
  }, [currentPage, token]);

  const handleModalClose = () => setShowCreateModal(false);
  const handleModalShow = () => setShowCreateModal(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const couponToCreate = {
        ...newCoupon,
        porcentajeDescuento: parseFloat(newCoupon.porcentajeDescuento),
        usosMaximos: parseInt(newCoupon.usosMaximos, 10),
        fechaExpiracion: new Date(newCoupon.fechaExpiracion).toISOString(),
      };
      await couponService.createCoupon(token, couponToCreate);
      handleModalClose();
      fetchCoupons(currentPage); // Recargar
    } catch (err) {
      console.error("Error al crear el cupón:", err);
      // Aquí podrías mostrar un error en el modal
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setEditFormData({
      codigo: coupon.codigo,
      porcentajeDescuento: coupon.porcentajeDescuento,
      fechaExpiracion: new Date(coupon.fechaExpiracion)
        .toISOString()
        .slice(0, 16),
      usosMaximos: coupon.usosMaximos,
      activo: coupon.activo,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      const couponToUpdate = {
        ...editFormData,
        porcentajeDescuento: parseFloat(editFormData.porcentajeDescuento),
        usosMaximos: parseInt(editFormData.usosMaximos, 10),
        fechaExpiracion: new Date(editFormData.fechaExpiracion).toISOString(),
      };
      await couponService.updateCoupon(token, editingCoupon.id, couponToUpdate);
      setShowEditModal(false);
      fetchCoupons(currentPage);
    } catch (err) {
      console.error("Error al actualizar el cupón:", err);
    }
  };
  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administrar Cupones</h1>
        <div>
          <Button variant="primary" onClick={handleModalShow} className="me-2">
            Crear Cupón
          </Button>
          <LinkContainer to="/admin">
            <Button variant="secondary">Volver al Menú</Button>
          </LinkContainer>
        </div>
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descuento (%)</th>
                <th>Expira</th>
                <th>Usos / Máximos</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(coupons || []).map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.codigo}</td>
                  <td>{coupon.porcentajeDescuento.toFixed(2)}%</td>
                  <td>
                    {new Date(coupon.fechaExpiracion).toLocaleDateString()}
                  </td>
                  <td>
                    {coupon.usosActuales} / {coupon.usosMaximos}
                  </td>
                  <td>{coupon.activo ? "Sí" : "No"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(coupon)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal de Creación */}
      <Modal show={showCreateModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Cupón</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCoupon}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={newCoupon.codigo}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Porcentaje de Descuento</Form.Label>
              <Form.Control
                type="number"
                name="porcentajeDescuento"
                value={newCoupon.porcentajeDescuento}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Expiración</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fechaExpiracion"
                value={newCoupon.fechaExpiracion}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Usos Máximos</Form.Label>
              <Form.Control
                type="number"
                name="usosMaximos"
                value={newCoupon.usosMaximos}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de Edición */}
      {editingCoupon && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Cupón</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdateCoupon}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  name="codigo"
                  value={editFormData.codigo}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Porcentaje de Descuento</Form.Label>
                <Form.Control
                  type="number"
                  name="porcentajeDescuento"
                  value={editFormData.porcentajeDescuento}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Expiración</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaExpiracion"
                  value={editFormData.fechaExpiracion}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Usos Máximos</Form.Label>
                <Form.Control
                  type="number"
                  name="usosMaximos"
                  value={editFormData.usosMaximos}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  label="Activo"
                  name="activo"
                  checked={editFormData.activo}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default AdminCouponsPage;
