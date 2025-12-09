import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosConfig.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  async function OnSend() {
    if (!email) {
      alert("Please put your email!");
    }
    try {
      const response = await api.post("/forgot-password", { email });
      alert("Please check your inbox for the reset link!");
      navigate("/login");
    } catch (err) {
      alert(`Error while reseting password: ${err}`);
    }
  }

  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Reset Password</h1>
        <label htmlFor="email" className="label">
          Email:
        </label>
        <TextField
          fullWidth
          size="small"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button className="passwordReset" onClick={() => OnSend()}>
          Send
        </Button>
      </div>
    </div>
  );
}
