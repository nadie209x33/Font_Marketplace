import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setComponentState,
  clearComponentState,
  setInitialComponentState,
} from "../redux/uiSlice";

const ProfileInformationPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const {
    oldPassword = "",
    newPassword = "",
    confirmPassword = "",
    error,
    success,
    loading,
  } = useSelector((state) => state.ui.componentState.ProfileInformationPage) ||
  {};

  React.useEffect(() => {
    dispatch(
      setInitialComponentState({
        component: "ProfileInformationPage",
        initialState: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          error: "",
          success: "",
          loading: false,
        },
      }),
    );
    return () => {
      dispatch(clearComponentState({ component: "ProfileInformationPage" }));
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      setComponentState({
        component: "ProfileInformationPage",
        key: "error",
        value: "",
      }),
    );
    dispatch(
      setComponentState({
        component: "ProfileInformationPage",
        key: "success",
        value: "",
      }),
    );

    if (newPassword !== confirmPassword) {
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "error",
          value: "Las contraseñas nuevas no coinciden.",
        }),
      );
      return;
    }

    if (newPassword.length < 6) {
      // Example validation
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "error",
          value: "La nueva contraseña debe tener al menos 6 caracteres.",
        }),
      );
      return;
    }

    dispatch(
      setComponentState({
        component: "ProfileInformationPage",
        key: "loading",
        value: true,
      }),
    );
    try {
      await userService.changePassword({ oldPassword, newPassword });
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "success",
          value: "¡Contraseña cambiada con éxito!",
        }),
      );
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "oldPassword",
          value: "",
        }),
      );
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "newPassword",
          value: "",
        }),
      );
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "confirmPassword",
          value: "",
        }),
      );
    } catch (err) {
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "error",
          value:
            err.response?.data?.message ||
            "Error al cambiar la contraseña. Por favor, verifica tu contraseña anterior.",
        }),
      );
    } finally {
      dispatch(
        setComponentState({
          component: "ProfileInformationPage",
          key: "loading",
          value: false,
        }),
      );
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
              onChange={(e) =>
                dispatch(
                  setComponentState({
                    component: "ProfileInformationPage",
                    key: "oldPassword",
                    value: e.target.value,
                  }),
                )
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Contraseña Nueva</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) =>
                dispatch(
                  setComponentState({
                    component: "ProfileInformationPage",
                    key: "newPassword",
                    value: e.target.value,
                  }),
                )
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirmar Contraseña Nueva</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                dispatch(
                  setComponentState({
                    component: "ProfileInformationPage",
                    key: "confirmPassword",
                    value: e.target.value,
                  }),
                )
              }
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
