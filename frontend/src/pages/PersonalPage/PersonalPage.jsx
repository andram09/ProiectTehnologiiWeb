import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { api } from "../../api/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import img from "../../assets/img_carti_homePage.jpg";
import "./PersonalPage.css";

export default function PersonalPage() {
  const navigate = useNavigate();

  const [np, setNp] = useState("");
  const [rp, setRp] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMatch, setErrorMatch] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    email: "",
  };
  const token = localStorage.getItem("token");

  const validations = (password) => {
    if (!password) return "Password is required";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter";
    if (!/\d/.test(password)) return "Must contain at least one numeric digit";
    if (!/[!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/~`]/.test(password))
      return "Must contain at least one special character";
    if (password.length <= 8)
      return "Password must be longer than 8 characters";
    return null;
  };

  const handleClickPassword = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNp("");
    setRp("");
    setErrorMatch(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPassword = np;
    const repeatPassword = rp;

    const error = validations(newPassword);
    if (error) return alert(error);

    if (newPassword !== repeatPassword) {
      setErrorMatch(true);
      return alert("Passwords do not match!");
    }

    try {
      await api.post(
        "/updatePass",
        { email: user.email, password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully!");
      handleClose();
      const role = user.role.toLowerCase();

      navigate(`/${role}`);

      handleClose();
    } catch (err) {
      console.error(err);
      alert(`Error while updating password: ${err.response?.data || err}`);
    }
  };
  const role = user.role.toLowerCase();

  return (
    <div className="personalPage">
      <div className="personalData">
        <img src={img} alt="Profile" />

        <div className="data">
          <div className="name">
            <h2>Name:</h2>
            <h1>{user.name}</h1>
          </div>

          <Button
            className="backHome"
            variant="contained"
            onClick={handleClickPassword}
          >
            Change password
          </Button>
        </div>
      </div>

      <Button
        variant="contained"
        className="backHome"
        onClick={() => {
          const role = user.role.toLowerCase();
          navigate(`/${role}`);

          handleClose();
        }}
      >
        Back home!
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change password!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All fields must be completed and correct!
          </DialogContentText>

          <form
            onSubmit={handleSubmit}
            id="password-form"
            style={{ marginTop: "1rem" }}
          >
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={np}
              onChange={(e) => {
                setNp(e.target.value);
                setErrorMatch(e.target.value !== rp);
              }}
              variant="standard"
              margin="dense"
            />

            <TextField
              label="Repeat Password"
              type="password"
              fullWidth
              required
              value={rp}
              error={errorMatch}
              helperText={errorMatch ? "Passwords do not match" : ""}
              onChange={(e) => {
                setRp(e.target.value);
                setErrorMatch(e.target.value !== np);
              }}
              variant="standard"
              margin="dense"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="password-form">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
