import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./auth.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/axiosConfig.js";
import "./auth.css";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMatch, setErrorMatch] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const id = params.get("id");

  const validations = () => {
    if (!password) return "Password is required";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCh = /[/!@#$%^&*()_\-+={}|\\:;"'<,>.?~`]/.test(password);
    const isLongEnough = password.length > 8;

    if (!hasUpperCase) return "Must contain at least one uppercase letter";
    if (!hasNumber) return "Must contain at least one numeric digit";
    if (!hasSpecialCh) return "Must contain at least one special character";
    if (!isLongEnough)
      return "Password length must be strictly greater than 8 characters";

    return null;
  };

  async function OnPasswordReset() {
    const error = validations();
    if (error) {
      alert(error);
      return;
    }
    if (!password || !repeatPassword) {
      alert("Complete both password fields!");
      return;
    }
    if (password !== repeatPassword) {
      setErrorMatch(true);
      return;
    }
    try {
      await api.post("/reset-password", {
        id,
        token,
        newPassword: password,
      });
      alert("Password succesfully updated!");
      navigate("/login");
    } catch (err) {
      alert(`Error while reseting password: ${err}`);
    }
  }

  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Reset Password</h1>
        <label htmlFor="password" className="label">
          Password:
        </label>
        <TextField
          fullWidth
          size="small"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMatch(e.target.value !== password);
          }}
        />
        <label htmlFor="password" className="label">
          Repeat password:
        </label>
        <TextField
          fullWidth
          size="small"
          value={repeatPassword}
          error={errorMatch}
          helperText={errorMatch ? "Passwords do not match" : ""}
          onChange={(e) => {
            setRepeatPassword(e.target.value);
            setErrorMatch(e.target.value !== password);
          }}
        />
        <Button className="passwordReset" onClick={OnPasswordReset}>
          Save!
        </Button>
      </div>
    </div>
  );
}
