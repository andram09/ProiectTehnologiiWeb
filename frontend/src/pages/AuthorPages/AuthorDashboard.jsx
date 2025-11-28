import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./AuthorDashboard.css"

export default function AuthorDashboard() {
    const [papers, setPapers] = useState([]);

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
            }
        ]);
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user.name;

    return (
        <div className="authorWrapper">
            <Header userName={userName} tabs={[{ label: "Conferences", to: "/login" }]} showLogout={true} />

            <Link to="/author/addPaper">
                <Button variant="contained" className="addNewBtn">
                    Add New Paper
                </Button>
            </Link>
            <div className="contentArea">
                <div className="tabelCard">
                    <table className="paperTable">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Conference</th>
                                <th>Status</th>
                                <th>Feedback</th>
                                <th>File</th>
                                <th>Updated</th>
                                <th>Modify</th>
                            </tr>
                        </thead>

                        <tbody>
                            {papers.map((paper) => (
                                <tr key={paper.id}>
                                    <td>{paper.title}</td>
                                    <td>{paper.conference}</td>
                                    <td>{paper.status}</td>

                                    <td>{paper.feedback ? <Link className="tableLink" to={`author/feedback/${paper.id}`}>View</Link> : "-"}</td>
                                    <td>
                                        <a href={paper.fileUrl} target="_blank" className="tableLink">PDF</a>
                                    </td>

                                    <td>{paper.updatedAt}</td>
                                    <td>
                                        <Button
                                            size="small" component={Link} to={`/author/editpaper/${paper.id}`} className="modifyBtn"
                                        >Modify</Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );

}