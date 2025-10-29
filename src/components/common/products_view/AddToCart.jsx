import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useCart } from "../../../hooks/useCart";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  overflow: hidden;

  .form-control {
    border: none;
    box-shadow: none;
    height: 100%;
  }

  .btn {
    border-radius: 0;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0.75rem 1rem;
  }
`;

const AddToCartButton = styled(Button)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  &:active {
    animation: ${pulse} 0.3s ease-in-out;
  }
`;

const AddToCart = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <Row className="mt-4 align-items-center">
      <Col md={5} className="mb-3 mb-md-0">
        <Form.Label className="fw-bold">Cantidad:</Form.Label>
        <QuantityControl>
          <Button variant="light" onClick={handleDecrement}>
            -
          </Button>
          <Form.Control
            type="text"
            className="text-center fw-bold"
            value={quantity}
            readOnly
          />
          <Button variant="light" onClick={handleIncrement}>
            +
          </Button>
        </QuantityControl>
      </Col>
      <Col md={7}>
        <div className="d-grid">
          <AddToCartButton
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
          </AddToCartButton>
        </div>
      </Col>
    </Row>
  );
};

export default AddToCart;
