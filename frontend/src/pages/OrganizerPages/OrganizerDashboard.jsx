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
import TablePaginationActions from "../components/TablePaginationActions.jsx";
import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import "./OrganizerDashboard.css";
import { getAllConferences, addConference } from "../../api/conference.js";
export default function OrganizerDashboard() {
  const [conferences, setConferences] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadConferences() {
      try {
        const data = await getAllConferences();
        console.log(data);
        setConferences(data);
      } catch (err) {
        console.log("Error while loading conferences: " + err);
      }
    }

    loadConferences();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const title = form.get("title");
    const description = form.get("description");
    const date = form.get("date");
    const time = form.get("time");

    try {
      const created = await addConference(title, description, date, time);
      setConferences((prev) => [...prev, created]);
      handleClose();
    } catch (err) {
      console.log("Error while creating conference: " + err);
      alert("Could not create conference");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRpws =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - conferences.length) : 0;

  return (
    <div className="conferenceWrapper">
      <Header
        userName={userName}
        tabs={[{ label: "Conferences", to: "/organizer" }]}
        showLogout
      />

      <div className="conferenceContent">
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
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Reviewers</strong>
                </TableCell>
                <TableCell>
                  <strong>See Reviewers</strong>
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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
                    <TableCell>{conf.reviewersCount}</TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        className="buttonTable"
                        size="small"
                      >
                        See Reviewers
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        className="buttonTable"
                        size="small"
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
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={conferences.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

      {/* Dialog add conference */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Conference</DialogTitle>
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
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              required
              variant="standard"
            />
            <TextField
              name="date"
              label="Date"
              fullWidth
              required
              variant="standard"
            />
            <TextField
              name="time"
              label="Time"
              fullWidth
              required
              variant="standard"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="add-form">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
