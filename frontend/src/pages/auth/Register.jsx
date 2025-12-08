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
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Parolele nu corespund!");
        return;
      }
      const data = await registerRequest({ name, email, password, role });
      alert("Your account has been created successfully!");
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
