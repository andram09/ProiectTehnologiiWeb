import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import "./OrganizerDashboard.css";
import { api } from "../../api/axiosConfig.js"
import TablePaginationActions from "../components/TablePaginationActions.jsx";
export default function OrganizerDashboard() {
  const [conferences, setConferences] = useState([]);
  const [open, setOpen] = useState(false);
  const [conferenceToEdit, setConferenceToEdit] = useState(null);

  useEffect(() => {
    async function loadConferences() {
      try {
        const response = await api.get("/conferences");

        setConferences(response.data);
      } catch (err) {
        console.log("Error while loading conferences: " + err);
      }
    }

    loadConferences();
  }, []);



  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPapers, setOpenPapers] = useState(false);
  const [papers, setPapers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const organiserId = user?.id;

  const handleAdd = () => { setConferenceToEdit(null); setOpen(true); };
  const handleClose = () => { setConferenceToEdit(null); setOpen(false); }

  const handleModify = (conf) => {
    setConferenceToEdit(conf);
    console.log("CONF SELECTED:", conf);

    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const title = form.get("title");
    const description = form.get("description");
    const date = form.get("date");
    const time = form.get("time");
    const location = form.get("location");

    try {
      if (conferenceToEdit != null) {
        const response = await api.put(`updateConference/${conferenceToEdit.id}`, {
          title,
          description,
          date,
          time,
          location,
          organiserId
        }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setConferences((prev) =>
          prev.map((c) =>
            c.id === conferenceToEdit.id
              ? { ...response.data, participants: c.participants }
              : c
          )
        );
      }
      else {
        const created = await api.post("/createConference", {
          title,
          description,
          date,
          time,
          location,
          organiserId
        }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        const res = await api.get("/conferences");
  setConferences(res.data);
      }
      handleClose();
    } catch (err) {
      console.log("Error while creating conference: " + err);
      alert("Could not create conference");
    }
  };
  async function handleSeePapers(conferenceId) {
    try {
      const res = await api.get(`/papersByConference/${conferenceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPapers(res.data);
      setOpenPapers(true);
    } catch (err) {
      console.error("Error loading papers:", err);
    }

  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRpws =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - conferences.length) : 0;
  const role = user.role.toLowerCase();
  return (
    <div className="organizerWrapper">
      <Header
        userName={userName}
        tabs={[
          { label: "Conferences", to: "./conferences" },
          { label: "Profile", to: `./profile` },
        ]}
        showLogout
      />

      <div className="organizerContent">
        <TableContainer component={Paper} className="organizerTableCard">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Participants</strong>
                </TableCell>
                <TableCell>
                  <strong>Modify</strong>
                </TableCell>
                <TableCell>
                  <strong>See Papers</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {conferences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center" }}>
                    There are no conferences yet.
                  </TableCell>
                </TableRow>
              ) : (
                (rowsPerPage > 0
                  ? conferences.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : conferences
                ).map((conf) => (
                  <TableRow key={conf.id}>
                    <TableCell>{conf.title}</TableCell>
                    <TableCell>{conf.participants ? conf.participants.length : 0}</TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        className="buttonTable"
                        size="small"
                        onClick={() => handleModify(conf)}
                      >
                        Modify
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className="buttonTable"
                        onClick={() => handleSeePapers(conf.id)}
                      >
                        See Papers
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {emptyRpws > 0 && (
                <TableRow style={{ height: 53 * emptyRpws }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                {
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={5}
                    count={conferences.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                }
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <div className="btnContainerOrganizer">
          <Button
            variant="contained"
            className="buttonAddConferenceOrganizer"
            onClick={handleAdd}
          >
            Add Conference
          </Button>
        </div>

      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> {conferenceToEdit ? "Update Conference" : "Add Conference"}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Complete all fields to add a new conference.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="add-form">
            <TextField
              name="title"
              label="Title"
              fullWidth
              required
              variant="standard"
              defaultValue={conferenceToEdit ? conferenceToEdit.title : ""}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              required
              variant="standard"
              defaultValue={conferenceToEdit ? conferenceToEdit.description : ""}
            />
            <TextField
              name="date"
              label="Date"
              fullWidth
              required
              variant="standard"
              defaultValue={conferenceToEdit ? conferenceToEdit.date : ""}
            />
            <TextField
              name="time"
              label="Time"
              fullWidth
              required
              variant="standard"
              defaultValue={conferenceToEdit ? conferenceToEdit.time : ""}
            />
            <TextField
              name="location"
              label="Location"
              defaultValue={conferenceToEdit ? conferenceToEdit.location : ""}
              fullWidth
              required
              variant="standard"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="add-form">
            {conferenceToEdit === null ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPapers} onClose={() => setOpenPapers(false)}>
        <DialogTitle>List of papers: </DialogTitle>

        <DialogContent>

          {
            papers.length === 0 ? (<p>No papers submitted yet.</p>) :
              (<Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Title
                    </TableCell>
                    <TableCell>
                      Author
                    </TableCell>
                    <TableCell>
                      File
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {
                    papers.map((paper) => {
                      return (<TableRow key={paper.id}>
                        <TableCell>
                          {paper.title}
                        </TableCell>
                        <TableCell>
                          {paper.authors[0]?.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={paper.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="tableLink"
                          >
                            PDF
                          </a>
                        </TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>

              )

          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPapers(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
