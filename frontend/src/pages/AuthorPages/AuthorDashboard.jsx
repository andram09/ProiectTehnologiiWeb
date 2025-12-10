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
} from "@mui/material";

export default function AuthorDashboard() {
  const [papers, setPapers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
                    <TableCell>{paper.Conference?.title}</TableCell>
                    <TableCell>{paper.status}</TableCell>

                    <TableCell>
                      {paper.feedback ? (
                        <Link
                          className="tableLink"
                          to={`/author/feedback/${paper.id}`}
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
      </div>
    </div>
  );
}
