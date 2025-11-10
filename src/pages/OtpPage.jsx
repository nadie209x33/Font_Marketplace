import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import createApiClient from "../services/apiClient";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const OtpCard = styled.div`
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 100%;
  max-width: 420px;
  border: none;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    box-sizing: border-box;
    transition:
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;

    &:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  button {
    width: 100%;
    padding: 0.85rem 1rem;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.1s;

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: center;
`;

const OtpPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiClient = createApiClient();
      await apiClient.post("/api/v1/auth/activate", { email, otp });
      // On success, redirect to the login page
      navigate("/login");
    } catch (err) {
      setError(
        "Error al activar la cuenta. Por favor, revisa tu correo electrónico y código OTP.",
      );
      console.error("Activation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <OtpCard>
        <Title>Verificar Cuenta</Title>
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </Form>
      </OtpCard>
    </PageContainer>
  );
};

export default OtpPage;
