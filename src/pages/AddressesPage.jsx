import React, { useState, useEffect } from 'react';
import { addressService } from '../services/addressService';
import { Button, Card, ListGroup, Alert, Spinner, Modal, Form } from 'react-bootstrap';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({ postalCode: '', street: '', apt: '', others: '', name: '' });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddresses();
      setAddresses(response.data);
    } catch (err) {
      setError('Error al cargar las direcciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowModal = (address = null) => {
    setSelectedAddress(address);
    setFormData(address ? { ...address } : { postalCode: '', street: '', apt: '', others: '', name: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAddress(null);
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddress) {
        await addressService.updateAddress(selectedAddress.addressId, formData);
      } else {
        await addressService.createAddress(formData);
      }
      fetchAddresses();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar la dirección.');
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      try {
        await addressService.deleteAddress(addressId);
        fetchAddresses();
      } catch (err) {
        setError('Error al eliminar la dirección.');
      }
    }
  };

  return (
    <Card>
      <Card.Header as="h2">Mis Direcciones</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
          Añadir Nueva Dirección
        </Button>
        {loading ? (
          <Spinner animation="border" />
        ) : addresses.length > 0 ? (
          <ListGroup>
            {addresses.map(addr => (
              <ListGroup.Item key={addr.addressId} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{addr.name}</strong><br />
                  {addr.street}, {addr.apt}<br />
                  {addr.postalCode}
                  {addr.others && <><br/><em>{addr.others}</em></>}
                </div>
                <div>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleShowModal(addr)} className="me-2">Editar</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(addr.addressId)}>Eliminar</Button>
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
          <Modal.Title>{selectedAddress ? 'Editar Dirección' : 'Añadir Nueva Dirección'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre de la Dirección (ej. Casa, Trabajo)</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="street">
              <Form.Label>Calle</Form.Label>
              <Form.Control type="text" name="street" value={formData.street} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="apt">
              <Form.Label>Apartamento, piso, etc.</Form.Label>
              <Form.Control type="text" name="apt" value={formData.apt} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control type="text" name="postalCode" value={formData.postalCode} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="others">
              <Form.Label>Otros detalles (opcional)</Form.Label>
              <Form.Control as="textarea" rows={2} name="others" value={formData.others} onChange={handleFormChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Guardar Dirección</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AddressesPage;