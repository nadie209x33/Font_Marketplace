import React, { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import {
  Button,
  Card,
  ListGroup,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" }); // For retry payment
  const token = useSelector((state) => state.auth.token);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await orderService.getMyOrders(token);
      // Sort orders by date, newest first
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.orderTimestamp) - new Date(a.orderTimestamp),
      );
      setOrders(sortedOrders);
    } catch {
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleRetryPayment = async (orderId) => {
    setFeedback({ type: "", message: "" });
    try {
      await orderService.retryPayment(token, orderId);
      setFeedback({
        type: "success",
        message: `Reintento de pago iniciado para el pedido #${orderId}. Actualizando...`,
      });
      setTimeout(fetchOrders, 2000); // Refresh orders after a short delay
    } catch {
      setFeedback({
        type: "danger",
        message: `Error al reintentar el pago para el pedido #${orderId}.`,
      });
    }
  };

  const getStatusInfo = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      // Payment Statuses
      case "SUCCESS":
      case "PAID":
        return { variant: "success", name: "Pagado" };
      case "WAITING":
      case "PENDING":
        return { variant: "warning", name: "Pendiente" };
      case "FAILED":
        return { variant: "danger", name: "Fallido" };

      // Order Statuses
      case "DELIVERED":
        return { variant: "success", name: "Entregado" };
      case "PLACED":
        return { variant: "warning", name: "Realizado" };
      case "START_DELIVERY":
      case "SHIPPED":
        return { variant: "info", name: "Enviado" };
      case "PROCESSING":
        return { variant: "primary", name: "Procesando" };
      case "CANCELLED":
        return { variant: "danger", name: "Cancelado" };

      default:
        return { variant: "secondary", name: status };
    }
  };

  return (
    <Card>
      <Card.Header as="h2">Mis Pedidos</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {feedback.message && (
          <Alert variant={feedback.type}>{feedback.message}</Alert>
        )}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => {
            const orderStatusInfo = getStatusInfo(order.orderStatus);
            const paymentStatusInfo = getStatusInfo(order.paymentStatus);

            return (
              <Card key={order.orderId} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Pedido #{order.orderId}</strong>
                    <br />
                    <small className="text-muted">
                      Fecha:{" "}
                      {new Date(order.orderTimestamp).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge bg={orderStatusInfo.variant}>
                      {orderStatusInfo.name}
                    </Badge>
                    <br />
                    <Badge bg={paymentStatusInfo.variant}>
                      {paymentStatusInfo.name}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {order.items.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between"
                      >
                        <span>
                          {item.productName} (x{item.quantity})
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item className="d-flex justify-content-between">
                      <strong>Total</strong>
                      <strong>${order.total.toFixed(2)}</strong>
                    </ListGroup.Item>
                  </ListGroup>
                  <div className="mt-3">
                    <p>
                      <strong>Dirección de Envío:</strong>{" "}
                      {order.deliveryAddress}
                    </p>
                    <p>
                      <strong>Método de Pago:</strong> {order.paymentMethod}
                    </p>
                  </div>
                  {order.paymentStatus === "FAILED" && (
                    <div className="text-end mt-2">
                      <Button
                        variant="warning"
                        onClick={() => handleRetryPayment(order.orderId)}
                      >
                        Reintentar Pago
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <p>No tienes pedidos.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrdersPage;
