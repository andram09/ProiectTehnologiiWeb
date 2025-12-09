import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../api/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const validations = () => {
    if (!name) return "Name is required";
    if (!/^[a-zA-Z\s]{3,}$/.test(name))
      return "Must contain only letters and spaces, minimum 3 characters";

    if (!email) return "Email is required";
    if (!/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return "Basic email format check";

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

    if (password !== confirmPassword) return "Passwords must match";

    const roles = ["AUTHOR", "REVIEWER", "ORGANIZER"];
    if (!role || !roles.includes(role))
      return "Role must be one of the predefined values";

    return null;
  };

  const handleRegister = async () => {
    try {
      const error = validations();
      if (error) {
        alert(error);
        return;
      }
      console.log("TRIMIT CATRE BACKEND:", { name, email, password, role });

      const data = await registerRequest({ name, email, password, role });
      //alert(`TRIMIT CATRE BACKEND:, ${name}, ${email}, ${password}, ${role} }`);
      alert("Your account has been created!");
      navigate(`/login`);
    } catch (err) {
      console.log("Err while creating account " + err);
    }
  };

  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Register</h1>

        <label htmlFor="text" className="label">
          Name
        </label>
        <TextField
          fullWidth
          size="small"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <label htmlFor="email" className="label">
          Email
        </label>
        <TextField
          fullWidth
          size="small"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <label className="label">Password</label>
        <TextField
          type="password"
          fullWidth
          size="small"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <label className="label">Confirm password</label>
        <TextField
          type="password"
          fullWidth
          size="small"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />

        <label className="label">Role:</label>
        <FormControl>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="AUTHOR">Author</MenuItem>
            <MenuItem value="REVIEWER">Reviewer</MenuItem>
            <MenuItem value="ORGANIZER">Organizer</MenuItem>
          </Select>
        </FormControl>
        <Button className="button-auth" onClick={handleRegister}>
          Register
        </Button>
        <a className="link-auth" href="/login">
          Already have an account
        </a>
      </div>
    </div>
  );
}
