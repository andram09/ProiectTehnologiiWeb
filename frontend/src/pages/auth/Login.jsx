import { TextField,Button } from "@mui/material";
import "./auth.css";


export default function Login() {
  
    

  return (
    <div className="auth-main">
      <div className="container-auth">
        <h1 className="auth-title">Login</h1>
        <label htmlFor="email"  className="label">Email:</label>
        <TextField fullWidth size="small" />
        <label className="label" htmlFor="password">Password</label>
        <TextField type="password" fullWidth size="small"/>
        <Button className="button-auth">Login</Button>
        <a className="link-auth" href="/register">Sign up here...</a>
      </div>
    </div>
  );
}
