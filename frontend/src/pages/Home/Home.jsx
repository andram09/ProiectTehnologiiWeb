import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Home.css";
import homeImg from "../../assets/img_carti_homePage.jpg";

export default function Home() {
  return (
    <div className="homeWrapper">
      <div className="homeContainer">
        <div className="homeCard">

          <Typography variant="h4" className="homeTitle">
            Welcome!
          </Typography>

          <Typography variant="body1" className="homeText">
            A platform designed for managing conferences, enabling authors to submit papers and reviewers to evaluate them.
          </Typography>

          <div className="homeButtons">
            <Button
              component={Link}
              to="/login"
              variant="contained"
              className="btnLogin"
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              className="btnRegister"
            >
              Register
            </Button>
          </div>

        </div>

        <img
          src={homeImg}
          alt="imagine_prezentare"
          className="homeImage"
        />

      </div>
    </div>
  );
}
