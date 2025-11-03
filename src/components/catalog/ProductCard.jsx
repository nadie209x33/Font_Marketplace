import React from "react";
import { Card as BootstrapCard, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthImage from "../common/AuthImage";
import styled from "styled-components";

const StyledCard = styled(BootstrapCard)`
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  border: none;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .card-img-top {
    height: 200px;
    object-fit: cover;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    min-height: 44px; /* Ensures titles of different lengths align */
  }
`;

const PriceButton = styled(Button)`
  font-weight: bold;
  font-size: 1.1rem;
`;

const ProductCard = ({ product }) => {
  const imageId =
    product.imageIds && product.imageIds.length > 0
      ? product.imageIds[0]
      : null;

  return (
    <Link to={`/product/${product.id}`} className="text-decoration-none">
      <StyledCard className="h-100">
        <AuthImage
          imageId={imageId}
          alt={product.name}
          variant="top"
          as={BootstrapCard.Img}
          className="card-img-top"
        />
        <BootstrapCard.Body>
          <BootstrapCard.Title className="card-title">
            {product.name}
          </BootstrapCard.Title>
          <div className="d-grid">
            <PriceButton variant="outline-primary">
              ${product.price ? product.price.toFixed(2) : "N/A"}
            </PriceButton>
          </div>
        </BootstrapCard.Body>
      </StyledCard>
    </Link>
  );
};

export default ProductCard;
