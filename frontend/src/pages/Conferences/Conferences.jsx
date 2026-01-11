import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import Header from "../components/Header.jsx";
import TablePaginationActions from "../components/TablePaginationActions.jsx";
import { api } from "../../api/axiosConfig.js";
import "./Conferences.css";

export default function Conferences() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const role = user.role.toLowerCase();

  const [myConferences, setMyConferences] = useState([]);
  const [allConferences, setAllConferences] = useState([]);

  const [pageLeft, setPageLeft] = useState(0);
  const [rowsLeft, setRowsLeft] = useState(5);

  const [pageRight, setPageRight] = useState(0);
  const [rowsRight, setRowsRight] = useState(5);

  useEffect(() => {
    loadMyConferences();
    loadAllConferences();
  }, []);

  async function loadMyConferences() {
    try {
      const res = await api.get(`/attendance/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMyConferences(res.data);
    } catch (err) {
      console.error("Error loading user conferences:", err);
    }
  }

  async function loadAllConferences() {
    try {
      const res = await api.get(`/conferences`);
      setAllConferences(res.data);
    } catch (err) {
      console.error("Error loading all conferences:", err);
    }
  }

  async function handleAttend(conferenceId) {
    try {
      await api.post(
        `/attendance`,
        { userId, conferenceId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      loadMyConferences();
    } catch (err) {
      console.error("Error attending conference:", err);
    }
  }

  return (
    <div className="conferenceWrapper">
      <Header
        userName={user.name}
        tabs={[
          { label: "Dashboard", to: `../${role}` },
          { label: "Profile", to: `../${role}/profile` },
        ]}
        showBack={true}
        showLogout={true}
      />

      <div className="conferenceContent">
        <div className="leftPanel">
          <h2 className="panelTitle">Your Conferences</h2>

          <TableContainer component={Paper} className="tableCard">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date/Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {myConferences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      You are not attending any conferences yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  myConferences
                    .slice(pageLeft * rowsLeft, pageLeft * rowsLeft + rowsLeft)
                    .map((conf) => (
                      <TableRow key={conf.id}>
                        <TableCell>{conf.title}</TableCell>
                        <TableCell>
                          {conf.date} {conf.time}
                        </TableCell>
                        <TableCell>{conf.location}</TableCell>
                        <TableCell>{conf.description}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={myConferences.length}
                    rowsPerPage={rowsLeft}
                    page={pageLeft}
                    onPageChange={(e, p) => setPageLeft(p)}
                    onRowsPerPageChange={(e) =>
                      setRowsLeft(parseInt(e.target.value, 10))
                    }
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>

        {/* RIGHT = all conferences */}
        <div className="rightPanel">
          <h2 className="panelTitle">Browse Conferences</h2>

          <TableContainer component={Paper} className="tableCard">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date/Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Attend</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {allConferences
                  .slice(
                    pageRight * rowsRight,
                    pageRight * rowsRight + rowsRight
                  )
                  .map((conf) => (
                    <TableRow key={conf.id}>
                      <TableCell>{conf.title}</TableCell>
                      <TableCell>
                        {conf.date} {conf.time}
                      </TableCell>
                      <TableCell>{conf.location}</TableCell>
                      <TableCell>{conf.description}</TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          className="attendBtn"
                          onClick={() => handleAttend(conf.id)}
                        >
                          Attend
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={allConferences.length}
                    rowsPerPage={rowsRight}
                    page={pageRight}
                    onPageChange={(e, p) => setPageRight(p)}
                    onRowsPerPageChange={(e) =>
                      setRowsRight(parseInt(e.target.value, 10))
                    }
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
