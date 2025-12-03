import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./AuthorDashboard.css";
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
} from "@mui/material";

export default function AuthorDashboard() {
  const [papers, setPapers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  useEffect(() => {
    setPapers([
      {
        id: 1,
        title: "Deep Learning for Cats",
        conference: "International AI Conference",
        status: "UNDER_REVIEW",
        feedback: null,
        fileUrl: "/uploads/cats.pdf",
        updatedAt: "2025-11-28",
      },
      {
        id: 2,
        title: "Econometrics for Beginners",
        conference: "Data Science Summit",
        status: "ACCEPTED",
        feedback: "Excellent work!",
        fileUrl: "/uploads/econometrics.pdf",
        updatedAt: "2025-11-20",
      },
    ]);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
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
        tabs={[{ label: "Conferences", to: "/login" }]}
        showLogout={true}
      />

      <div className="contentArea">
        <Link to="/author/addPaper">
          <Button variant="contained" className="addNewBtn">
            Add New Paper
          </Button>
        </Link>
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
                    <TableCell>{paper.conference}</TableCell>
                    <TableCell>{paper.status}</TableCell>

                    <TableCell>
                      {paper.feedback ? (
                        <Link
                          className="tableLink"
                          to={`author/feedback/${paper.id}`}
                        >
                          View
                        </Link>
                      ) : (
                        "-"
                      )}
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

                    <TableCell>{paper.updatedAt}</TableCell>

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
                  colSpan={5}
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
      </div>
    </div>
  );
}
