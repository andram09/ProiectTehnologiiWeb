import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import "./ReviewerDashboard.css";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/axiosConfig.js";
import TablePaginationActions from "../components/TablePaginationActions.jsx";
import {
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

export default function ReviewerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.name;

  const [papersToReview, setPapersToReview] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function loadPapers() {
      try {
        const response = await api.get("/papersAssignedToMe", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setPapersToReview(response.data);
      } catch (err) {
        console.log("Error loading assigned papers", err);
      }
    }

    loadPapers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - papersToReview.length)
      : 0;

  return (
    <div className="reviewerWrapper">
      <Header
        userName={name}
        tabs={[
          { label: "Conferences", to: "./conferences" },
          { label: "Profile", to: `./profile` },
        ]}
      />

      <div className="reviewerContent">
        <TableContainer component={Paper} className="reviewerTableCard">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Author</strong>
                </TableCell>
                <TableCell>
                  <strong>Received Date</strong>
                </TableCell>
                <TableCell>
                  <strong>File</strong>
                </TableCell>
                <TableCell>
                  <strong>Review</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {papersToReview.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    No papers assigned yet.
                  </TableCell>
                </TableRow>
              ) : (
                papersToReview.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>
                      {paper.authors && paper.authors.length > 0
                        ? paper.authors[0].name
                        : "-"}
                    </TableCell>
                    <TableCell>{paper.receivedAt}</TableCell>

                    <TableCell>
                      <a
                        className="tableLink"
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        PDF
                      </a>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        className="buttonTable"
                        component={Link}
                        to={`/reviewer/add/${paper.id}`}
                      >
                        Add Review
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
                  colSpan={5}
                  count={papersToReview.length}
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
    </div>
  );
}
