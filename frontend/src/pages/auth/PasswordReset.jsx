import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function OnEmailReset() {
    if (!email) {
      alert("Please put your email!");
      return;
    }
    try {
    } catch (error) {}
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
        <Button className="passwordReset" onClick={OnEmailReset}>
          Send
        </Button>
      </div>
    </div>
  );
}
