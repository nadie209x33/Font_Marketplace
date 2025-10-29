import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthImage from "../components/common/AuthImage";

const CartPage = () => {
  const {
    cart, // El objeto completo del carrito: { items, subTotal, discount, ... }
    items, // El array de items para conveniencia
    loading,
    error,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      try {
        setCouponError(null);
        applyCoupon(couponCode.trim());
        setCouponCode("");
      } catch {
        setCouponError("El cupón no es válido o ha expirado.");
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p>Cargando carrito...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p>No has añadido ningún producto todavía.</p>
        <Button as={Link} to="/">
          Ir a la tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <h2>Tu Carrito ({items.length})</h2>
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <AuthImage
                    imageId={item.imageId}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      marginRight: "1rem",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-1 text-muted">
                      Precio: ${item.price.toFixed(2)}
                    </p>
                    <div className="d-flex align-items-center mt-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          updateCartItem(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="mx-3 font-weight-bold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          updateCartItem(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen del Pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${cart.subTotal.toFixed(2)}</span>
                </ListGroup.Item>
                {cart.discount > 0 && (
                  <ListGroup.Item className="d-flex justify-content-between text-success">
                    <span>Descuento ({cart.couponCode})</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>${cart.total.toFixed(2)}</strong>
                </ListGroup.Item>
              </ListGroup>

              <div className="mt-3">
                {cart.couponCode ? (
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      Cupón: <strong>{cart.couponCode}</strong>
                    </span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleRemoveCoupon}
                    >
                      Quitar
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleApplyCoupon}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError(null);
                        }}
                        isInvalid={!!couponError}
                      />
                      <Button type="submit" variant="primary">
                        Aplicar
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {couponError}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form>
                )}
              </div>

              <div className="d-grid gap-2 mt-3">
                <Button
                  as={Link}
                  to="/checkout"
                  variant="primary"
                  size="lg"
                  disabled={items.length === 0}
                >
                  Proceder al Pago
                </Button>
                <Button variant="outline-danger" size="sm" onClick={clearCart}>
                  Vaciar Carrito
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
