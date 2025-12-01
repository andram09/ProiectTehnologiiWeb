import { Button } from "@mui/material";
import { Link } from "react-router-dom"
import Header from "../components/Header.jsx"
import "./ReviewerDashboard.css";
import { useState } from "react";
import { useEffect } from "react";

export default function ReviewerDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user.name;

    const [papersToReview, setPapersToReview] = useState([]);

    useEffect(() => {
        setPapersToReview([
            {
                id: 1,
                title: "Deep Learning for Cats",
                author: "Andra Moise",
                receivedAt: "2025-11-28",
                fileUrl: "/uploads/cats.pdf",
            },
            {
                id: 2,
                title: "Econometrics 101",
                author: "Andrei Ionescu",
                receivedAt: "2025-11-20",
                fileUrl: "/uploads/econometrics.pdf",
            },
            {
                id: 3,
                title: "AI Ethics Paper",
                author: "Bianca Pavel",
                receivedAt: "2025-11-13",
                fileUrl: "/uploads/ai-ethics.pdf",
            },
        ]);
    }, []);

    return (
        <div className="reviewerWrapper">
            <Header userName={name}
                tabs={[
                    { label: "Past Reviews", to: "/reviewer/past-reviews" },
                    { label: "Conferences", to: "/reviewer/conferences" }
                ]} />

            <div className="reviewerContent">

                <div className="reviewerTableCard">
                    <table className="reviewerTable">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Received Date</th>
                                <th>File</th>
                                <th>Review</th>
                            </tr>
                        </thead>

                        <tbody>
                            {papersToReview.map((paper) => (
                                <tr key={paper.id}>
                                    <td>{paper.title}</td>
                                    <td>{paper.author}</td>
                                    <td>{paper.receivedAt}</td>

                                    <td>
                                        <a
                                            className="tableLink"
                                            href={paper.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            PDF
                                        </a>
                                    </td>

                                    <td>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            className="addReviewBtn"
                                            component={Link}
                                            to={`/reviewer/add/${paper.id}`}
                                        >
                                            Add Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>


        </div>
    )
}