import { 
  Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, TextField, DialogActions,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper
} from "@mui/material";

import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import "./OrganizerDashboard.css";

export default function OrganizerDashboard() {
  const [conferences, setConferences] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setConferences([
      { id: 1, title: "International AI Conference", description: "AI & ML", reviewers: [] },
      { id: 2, title: "Data Science Summit", description: "Data Engineering", reviewers: ["R1"] },
      { id: 3, title: "Machine Learning Expo", description: "ML Research", reviewers: ["R1", "R2"] }
    ]);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const title = form.get("title");
    const description = form.get("description");

    setConferences(prev => [
      ...prev,
      {
        id: prev.length + 1,
        title,
        description,
        reviewers: []
      }
    ]);

    handleClose();
  };

  return (
    <div className="conferenceWrapper">

      <Header 
        userName={userName} 
        tabs={[{ label: "Conferences", to: "/organizer" }]} 
        showLogout 
      />

      <div className="conferenceContent">

        <div className="contentInner">

          <Button 
            variant="contained" 
            className="buttonAddConference"
            onClick={handleClickOpen}
          >
            Add Conference
          </Button>

          <TableContainer component={Paper} className="conferenceTableCard">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Reviewers</strong></TableCell>
                  <TableCell><strong>See Reviewers</strong></TableCell>
                  <TableCell><strong>Modify</strong></TableCell>
                  <TableCell><strong>See Papers</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {conferences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      There are no conferences yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  conferences.map(conf => (
                    <TableRow key={conf.id}>
                      <TableCell>{conf.title}</TableCell>
                      <TableCell>{conf.reviewers.length}</TableCell>

                      <TableCell>
                        <Button variant="contained" color="success" size="small">
                          See Reviewers
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button variant="outlined" color="primary" size="small">
                          Modify
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button variant="contained" color="secondary" size="small">
                          See Papers
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </div>
      </div>

      {/* Dialog add conference */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Conference</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete all fields to add a new conference.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="add-form">
            <TextField name="title" label="Title" fullWidth required variant="standard" />
            <TextField name="description" label="Description" fullWidth required variant="standard" />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="add-form">Add</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
