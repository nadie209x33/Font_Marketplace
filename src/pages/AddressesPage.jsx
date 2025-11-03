import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../redux/addressSlice";
import {
  Card,
  ListGroup,
  Spinner,
  Alert,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import {
  setComponentState,
  clearComponentState,
  setInitialComponentState,
} from "../redux/uiSlice";

const AddressesPage = () => {
  const dispatch = useDispatch();
  const {
    addresses,
    loading,
    error: reduxError,
  } = useSelector((state) => state.address);
  const {
    showModal,
    selectedAddress,
    formData = { postalCode: "", street: "", apt: "", others: "", name: "" },
    error,
  } = useSelector((state) => state.ui.componentState.AddressesPage) || {};

  React.useEffect(() => {
    dispatch(
      setInitialComponentState({
        component: "AddressesPage",
        initialState: {
          showModal: false,
          selectedAddress: null,
          formData: {
            postalCode: "",
            street: "",
            apt: "",
            others: "",
            name: "",
          },
          error: "",
        },
      }),
    );
    return () => {
      dispatch(clearComponentState({ component: "AddressesPage" }));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleFormChange = (e) => {
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "formData",
        value: { ...formData, [e.target.name]: e.target.value },
      }),
    );
  };

  const handleShowModal = (address = null) => {
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "selectedAddress",
        value: address,
      }),
    );
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "formData",
        value: address
          ? { ...address }
          : { postalCode: "", street: "", apt: "", others: "", name: "" },
      }),
    );
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "showModal",
        value: true,
      }),
    );
  };

  const handleCloseModal = () => {
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "showModal",
        value: false,
      }),
    );
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "selectedAddress",
        value: null,
      }),
    );
    dispatch(
      setComponentState({
        component: "AddressesPage",
        key: "error",
        value: "",
      }),
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedAddress) {
      dispatch(
        updateAddress({ id: selectedAddress.addressId, addressData: formData }),
      );
    } else {
      dispatch(createAddress(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (addressId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")
    ) {
      dispatch(deleteAddress(addressId));
    }
  };

  return (
    <Card>
      <Card.Header as="h2">Mis Direcciones</Card.Header>
      <Card.Body>
        {reduxError && <Alert variant="danger">{reduxError}</Alert>}
        <Button
          variant="primary"
          onClick={() => handleShowModal()}
          className="mb-3"
        >
          Añadir Nueva Dirección
        </Button>
        {loading ? (
          <Spinner animation="border" />
        ) : addresses.length > 0 ? (
          <ListGroup>
            {addresses.map((addr) => (
              <ListGroup.Item
                key={addr.addressId}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{addr.name}</strong>
                  <br />
                  {addr.street}, {addr.apt}
                  <br />
                  {addr.postalCode}
                  {addr.others && (
                    <>
                      <br />
                      <em>{addr.others}</em>
                    </>
                  )}
                </div>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleShowModal(addr)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(addr.addressId)}
                  >
                    Eliminar
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No tienes direcciones guardadas.</p>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAddress ? "Editar Dirección" : "Añadir Nueva Dirección"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>
                Nombre de la Dirección (ej. Casa, Trabajo)
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="street">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="apt">
              <Form.Label>Apartamento, piso, etc.</Form.Label>
              <Form.Control
                type="text"
                name="apt"
                value={formData.apt}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="others">
              <Form.Label>Otros detalles (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="others"
                value={formData.others}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Dirección
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AddressesPage;
