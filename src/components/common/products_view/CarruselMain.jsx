import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import AuthImage from "../AuthImage";
import styled from "styled-components";

const ZoomableImageContainer = styled.div`
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  aspect-ratio: 1 / 1;

  .auth-image {
    transition: transform 0.3s ease;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover .auth-image {
    transform: scale(1.2);
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const Thumbnail = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 5px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &.active {
    border-color: #007bff;
  }

  &:hover {
    border-color: #0056b3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarruselMain = ({ imageIds = [] }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  if (imageIds.length === 0) {
    return (
      <AuthImage
        imageId={null}
        alt="Producto sin imagen"
        className="d-block w-100"
      />
    );
  }

  return (
    <>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
        {imageIds.map((id, idx) => (
          <Carousel.Item key={id}>
            <ZoomableImageContainer>
              <AuthImage
                imageId={id}
                alt={`Imagen de producto ${idx + 1}`}
                className="d-block w-100 auth-image"
              />
            </ZoomableImageContainer>
          </Carousel.Item>
        ))}
      </Carousel>
      <ThumbnailContainer>
        {imageIds.map((id, idx) => (
          <Thumbnail
            key={id}
            className={idx === index ? "active" : ""}
            onClick={() => setIndex(idx)}
          >
            <AuthImage imageId={id} alt={`Thumbnail ${idx + 1}`} />
          </Thumbnail>
        ))}
      </ThumbnailContainer>
    </>
  );
};

export default CarruselMain;
