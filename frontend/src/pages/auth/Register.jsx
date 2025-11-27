import { TextField, Button, MenuItem, Select, FormControl } from "@mui/material";
import { useState } from "react";
import "./auth.css"

export default function Register() {
  const [role, setRole] =useState("");
  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Register</h1>

        <label htmlFor="text" className="label">Name</label>
        <TextField fullWidth size="small" />

        <label htmlFor="email" className="label">Email</label>
        <TextField fullWidth size="small" />

        <label className="label">Password</label>
        <TextField type="password" fullWidth size="small"/>

        <label className="label">Confirm password</label>
        <TextField type="password" fullWidth size="small"/>

        <label className="label">Role:</label>
        <FormControl>
          <Select value={role} onChange={(e)=> setRole(e.target.value)}>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="reviewer">Reviewer</MenuItem>
            <MenuItem value="organizer">Organizer</MenuItem>
          </Select>
        </FormControl>
        <Button className="button-auth">Login</Button>
        <a className="link-auth" href="/login">Already have an account</a>
      </div>
    </div>
  );
}
