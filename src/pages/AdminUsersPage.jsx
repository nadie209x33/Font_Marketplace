import React, { useState, useEffect } from 'react';
import { Container, Table, Button, ButtonGroup, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios. Por favor, inténtalo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtp(null);
    setOtpError(null);
  };

  const handleShowOtp = async (userId) => {
    setShowOtpModal(true);
    setOtpLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/admin/users/${userId}/otp`);
      setOtp(response.data.otp);
    } catch (err) {
      setOtpError('Error al obtener el OTP.');
      console.error(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegenerateOtp = async (userId) => {
    setShowOtpModal(true);
    setOtpLoading(true);
    try {
      const response = await apiClient.post(`/api/v1/admin/users/${userId}/regenerate-otp`);
      setOtp(response.data.otp);
    } catch (err) {
      setOtpError('Error al regenerar el OTP.');
      console.error(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      mail: user.mail,
      password: '', // Password is not pre-filled for security
      isEnabled: user.isActive,
      isEmailConfirmed: user.isEmailConfirmed,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const payload = { ...editFormData };
    if (!payload.password) {
      delete payload.password; // Do not send empty password
    }

    try {
      await apiClient.put(`/api/v1/admin/users/${editingUser.userId}`, payload);
      setShowEditModal(false);
      fetchUsers(); // Re-fetch users to show updated data
    } catch (err) {
      console.error('Failed to update user', err);
      // You might want to show an error message in the modal
    }
  };

  const handleUpgrade = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres ascender a este usuario a ADMIN?')) {
      try {
        await apiClient.post(`/api/v1/users/${userId}/upgrade`);
        fetchUsers();
      } catch (err) {
        console.error('Error al ascender al usuario', err);
        alert('Error al ascender al usuario.');
      }
    }
  };

  const handleDowngrade = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres degradar a este usuario a USER?')) {
      try {
        await apiClient.post(`/api/v1/users/${userId}/downgrade`);
        fetchUsers();
      } catch (err) {
        console.error('Error al degradar al usuario', err);
        alert('Error al degradar al usuario.');
      }
    }
  };

  const renderStatus = (user) => (
    <>
      <Badge bg={user.isActive ? 'success' : 'secondary'} className="me-1">
        {user.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
      <Badge bg={user.isEmailConfirmed ? 'primary' : 'warning'}>
        {user.isEmailConfirmed ? 'Verificado' : 'No Verificado'}
      </Badge>
    </>
  );

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administrar Usuarios</h1>
        <LinkContainer to="/admin">
          <Button variant="secondary">Volver al Menú de Administrador</Button>
        </LinkContainer>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.mail}</td>
                <td>{user.authLevel}</td>
                <td>{renderStatus(user)}</td>
                <td>
                  <ButtonGroup>
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(user)}>Editar</Button>
                    <Button variant="outline-info" size="sm" onClick={() => handleShowOtp(user.userId)}>Ver OTP</Button>
                    <Button variant="outline-warning" size="sm" onClick={() => handleRegenerateOtp(user.userId)}>Regenerar OTP</Button>
                    {user.authLevel === 'USER' && (
                      <Button variant="success" size="sm" onClick={() => handleUpgrade(user.userId)} disabled={currentUser?.userId === user.userId}>Ascender</Button>
                    )}
                    {user.authLevel === 'ADMIN' && (
                      <Button variant="danger" size="sm" onClick={() => handleDowngrade(user.userId)} disabled={currentUser?.userId === user.userId}>Degradar</Button>
                    )}
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={handleCloseOtpModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>OTP del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {otpLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          )}
          {otpError && <Alert variant="danger">{otpError}</Alert>}
          {otp && !otpError && (
            <>
              <p>El código de un solo uso es:</p>
              <h3 className="user-select-all">{otp}</h3>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOtpModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario: {editingUser.firstName} {editingUser.lastName}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdateUser}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="firstName" value={editFormData.firstName} onChange={handleEditFormChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" name="lastName" value={editFormData.lastName} onChange={handleEditFormChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" name="mail" value={editFormData.mail} onChange={handleEditFormChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" placeholder="Dejar en blanco para mantener la contraseña actual" value={editFormData.password} onChange={handleEditFormChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="switch" label="Habilitado" name="isEnabled" checked={editFormData.isEnabled} onChange={handleEditFormChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="switch" label="Correo Confirmado" name="isEmailConfirmed" checked={editFormData.isEmailConfirmed} onChange={handleEditFormChange} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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

export default AdminUsersPage;
