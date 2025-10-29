import React from "react";
import { Container, Button, Stack } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AdminPage = () => {
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Modo Administrador</h1>
      <Stack gap={3} className="col-md-5 mx-auto">
        <LinkContainer to="/admin/users">
          <Button variant="primary" size="lg">
            Administrar Usuarios
          </Button>
        </LinkContainer>
        <LinkContainer to="/admin/orders">
          <Button variant="secondary" size="lg">
            Administrar Pedidos
          </Button>
        </LinkContainer>
        <LinkContainer to="/admin/products">
          <Button variant="success" size="lg">
            Administrar Productos
          </Button>
        </LinkContainer>
        <LinkContainer to="/admin/coupons">
          <Button variant="info" size="lg">
            Administrar Cupones
          </Button>
        </LinkContainer>
      </Stack>
    </Container>
  );
};

export default AdminPage;
