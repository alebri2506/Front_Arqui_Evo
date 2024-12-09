import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";
import { useAuth } from "../context/AuthContext";
import { Card, CardTitle } from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { LOGIN_USER } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      console.log(data);
      localStorage.setItem("authToken", data.loginUser.token);
      login(data.loginUser, data.loginUser.token);
      navigate("/");
    },
    onError: () => {
      console.log("Credenciales incorrectas");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser({
      variables: { email, password },
    });
    console.log(res);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Ingrese a su cuenta</CardTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </Card>
    </div>
  );
}
