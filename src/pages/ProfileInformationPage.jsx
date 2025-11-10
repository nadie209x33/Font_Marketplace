import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProfileInformationPage = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      // Example validation
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(token, { oldPassword, newPassword });
      setSuccess("¡Contraseña cambiada con éxito!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al cambiar la contraseña. Por favor, verifica tu contraseña anterior.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header as="h2">Mi Información</Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>Nombre:</strong> {user?.name}
        </Card.Text>
        <Card.Text className="mb-4">
          <strong>Correo Electrónico:</strong> {user?.email}
        </Card.Text>

        <hr />

        <h4 className="mt-4">Cambiar Contraseña</h4>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form.Group className="mb-3" controlId="oldPassword">
            <Form.Label>Contraseña Antigua</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Contraseña Nueva</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirmar Contraseña Nueva</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Cambiar Contraseña"
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileInformationPage;
