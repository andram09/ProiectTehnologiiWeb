import { TextField, Button } from "@mui/material";
import "./auth.css";
import { useState } from "react";
import { loginRequest } from "../../api/auth.js"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginRequest(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "organizer") {
        window.location.href = "/author";
      }
      else if (data.user.role === "reviewer") {
        window.location.href = "/author";
      }
      else {
        window.location.href = "/author";
      }
    }
    catch (error) {
      alert("Email or wrong password!");
    }
  }

  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Login</h1>
        <label htmlFor="email" className="label">Email:</label>
        <TextField fullWidth size="small" value={email} onChange={(e) => {
          setEmail(e.target.value)
        }} />
        <label className="label" htmlFor="password">Password</label>
        <TextField type="password" fullWidth size="small" value={password} onChange={(e) => {
          setPassword(e.target.value)
        }} />
        <Button className="button-auth" onClick={handleLogin}>Login</Button>
        <a className="link-auth" href="/register">Sign up here...</a>
      </div>
    </div>
  );
}
