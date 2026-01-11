import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import "./AuthorDashboard.css";
import axios from "axios";
import { api } from "../../api/axiosConfig.js";
import TablePaginationActions from "../components/TablePaginationActions.jsx";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function AuthorDashboard() {
  const [papers, setPapers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("");

  const handleOpenFeedback = async (paperId) => {
    try {
      const response = await api.get(`/reviewByPaperId/${paperId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const toateFeedbackurile = response.data
        .map((r) => `REVIEW: ${r.feedback}`)
        .join("\n\n---\n\n");

      setSelectedFeedback(toateFeedbackurile);
    } catch (error) {
      setSelectedFeedback("Nu exista feedback momentan");
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchPapers() {
      try {
        const response = await api.get(`/PapersByAuthor/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setPapers(response.data);
      } catch (error) {
        console.log(`Error while getting papers: ${error}`);
      }
    }
    fetchPapers();
  }, []);
  const userName = user.name;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - papers.length) : 0;

  return (
    <div className="authorWrapper">
      <Header
        userName={userName}
        tabs={[
          { label: "Conferences", to: "./conferences" },
          { label: "Profile", to: `./profile` },
        ]}
        showLogout={true}
      />

      <div className="contentArea">
        <TableContainer component={Paper} className="tabelCard">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Conference</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Feedback</strong>
                </TableCell>
                <TableCell>
                  <strong>File</strong>
                </TableCell>
                <TableCell>
                  <strong>Updated</strong>
                </TableCell>
                <TableCell>
                  <strong>Modify</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {papers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    No papers submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                papers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>{paper.Conference?.title}</TableCell>
                    <TableCell>{paper.status}</TableCell>

                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleOpenFeedback(paper.id)}
                        className="modifyBtn"
                      >
                        View
                      </Button>
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

                    <TableCell>
                      {new Date(paper.updatedAt).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        className="modifyBtn"
                        component={Link}
                        to={`/author/editpaper/${paper.id}`}
                      >
                        Modify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={7}
                  count={papers.length}
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
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Feedback</DialogTitle>
          <DialogContent dividers>
            <div style={{ whiteSpace: "pre-line" }}>{selectedFeedback}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <div className="btnContainer">
          <Button
            variant="contained"
            className="addNewBtn"
            component={Link}
            to="/author/addPaper"
          >
            Add Paper
          </Button>
        </div>
      </div>
    </div>
  );
}
