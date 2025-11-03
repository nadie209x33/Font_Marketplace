import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../redux/orderSlice";
import { LinkContainer } from "react-router-bootstrap";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Table,
  Badge,
  ButtonGroup,
  Modal,
  Row,
  Col,
  Form,
} from "react-bootstrap";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    orderStatus: "",
    paymentStatus: "",
  });

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleShowEditStatus = (order) => {
    setEditingOrder(order);
    setStatusData({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });
    setShowEditStatusModal(true);
  };

  const handleCloseEditStatusModal = () => {
    setShowEditStatusModal(false);
    setEditingOrder(null);
  };

  const handleStatusFormChange = (e) => {
    const { name, value } = e.target;
    setStatusData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (statusData.orderStatus !== editingOrder.orderStatus) {
      dispatch(
        updateOrderStatus({
          orderId: editingOrder.orderId,
          newStatus: statusData.orderStatus,
        }),
      );
    }
    if (statusData.paymentStatus !== editingOrder.paymentStatus) {
      dispatch(
        updatePaymentStatus({
          paymentId: editingOrder.paymentId,
          newStatus: statusData.paymentStatus,
        }),
      );
    }
    handleCloseEditStatusModal();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
      case "DELIVERED":
        return "success";
      case "WAITING":
      case "PLACED":
        return "warning";
      case "FAILED":
        return "danger";
      case "START_DELIVERY":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administrar Pedidos</h1>
        <LinkContainer to="/admin">
          <Button variant="secondary">Volver al Menú de Administrador</Button>
        </LinkContainer>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Email Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado de Pago</th>
              <th>Estado del Pedido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.userEmail}</td>
                <td>{new Date(order.orderTimestamp).toLocaleString()}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <Badge bg={getStatusBadge(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getStatusBadge(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </td>
                <td>
                  <ButtonGroup>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleShowDetails(order)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowEditStatus(order)}
                    >
                      Editar Estado
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalles del Pedido #{selectedOrder?.orderId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row>
                <Col md={6}>
                  <h5>Información de Entrega</h5>
                  <p>
                    <strong>Proveedor:</strong> {selectedOrder.deliveryProvider}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedOrder.deliveryAddress}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Información de Pago</h5>
                  <p>
                    <strong>Método:</strong> {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <strong>ID de Pago:</strong> {selectedOrder.paymentId}
                  </p>
                  <p>
                    <strong>Fecha del Pedido:</strong>{" "}
                    {new Date(selectedOrder.orderTimestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Fecha del Pago:</strong>{" "}
                    {new Date(selectedOrder.paymentTimestamp).toLocaleString()}
                  </p>
                </Col>
              </Row>
              <hr />
              <h5>Artículos</h5>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Status Modal */}
      <Modal show={showEditStatusModal} onHide={handleCloseEditStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Estado del Pedido #{editingOrder?.orderId}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateStatus}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Estado de Pago</Form.Label>
              <Form.Select
                name="paymentStatus"
                value={statusData.paymentStatus}
                onChange={handleStatusFormChange}
              >
                <option value="WAITING">WAITING</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado del Pedido</Form.Label>
              <Form.Select
                name="orderStatus"
                value={statusData.orderStatus}
                onChange={handleStatusFormChange}
              >
                <option value="PLACED">PLACED</option>
                <option value="START_DELIVERY">START_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditStatusModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminOrdersPage;
