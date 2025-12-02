import { TextField, Button, MenuItem } from "@mui/material";
import Header from "../components/Header";
import "./AddReview.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AddReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const name = user.name;

    const [paper, setPaper] = useState(null);
    const [decision, setDecision] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        setPaper({
            id,
            title: "Deep Learning for Cats",
            author: "Andra Moise",
            fileUrl: "/uploads/cats.pdf",
            receivedAt: "2025-11-28",
        });
    }, [id]);
    const handleSubmit = () => {
        if (!decision) {
            alert("Please select a decision.");
            return;
        }

        if (decision === "REJECTED" && !feedback.trim()) {
            alert("Feedback is required when rejecting.");
            return;
        }

        console.log("REVIEW TRIMIS:", {
            paperId: paper.id,
            decision,
            feedback,
        });

        // aici se trimite spre backend
        // await fetch("/api/reviews", { method:"POST", body: JSON.stringify({...}) })

        navigate("/reviewer");
    };

    return (
        <div className="addReviewWrapper">
            <Header
                userName={name}
                tabs={[
                    { label: "Dashboard", to: "/reviewer" },
                ]}
            />
            <div className="addReviewContainer">
                <div className="reviewFormCard">
                    <h2 className="reviewTitle">Review Paper</h2>
                    <p className="reviewSubtitle">{paper?.title}</p>

                    <label className="label">Decision</label>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                    >
                        <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
                        <MenuItem value="REJECTED">REJECTED</MenuItem>
                    </TextField>

                    {decision === "REJECTED" && (
                        <>
                            <label className="label">Feedback</label>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                size="small"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </>
                    )}

                    <Button
                        variant="contained"
                        className="submitReviewBtn"
                        onClick={handleSubmit}
                    >
                        Submit Review
                    </Button>
                </div>

                <div className="pdfCard">
                    <h3 className="pdfTitle">Attached Paper</h3>
                    <a
                        href={paper?.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pdfLink"
                    >
                        Open PDF
                    </a>
                </div>
            </div>
        </div>
    )
}