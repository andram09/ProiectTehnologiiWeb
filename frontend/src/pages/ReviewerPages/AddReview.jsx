import { TextField, Button, MenuItem } from "@mui/material";
import Header from "../components/Header.jsx";
import "./AddReview.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosConfig.js";

export default function AddReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.name;

  const [paper, setPaper] = useState(null);
  const [decision, setDecision] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadPaper() {
      try {
        const response = await api.get(`/paper/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setPaper(response.data);
      } catch (err) {
        console.log("Error loading paper:", err);
        alert("Could not load paper data.");
      }
    }

    loadPaper();
  }, [id]);

  const validations = () => {
    if (!paper) return "Paper must be loaded";

    if (!decision) return "Please select a decision before submitting.";

    if (decision === "REJECTED") {
      if (!feedback.trim())
        return "Feedback is required when the paper is rejected.";

      if (feedback.trim().length < 10)
        return "Feedback must contain at least 10 characters.";
    }

    return null; // totul e ok
  };

  const handleSubmit = async () => {
    const error = validations();
    if (error) {
      alert(error);
      return;
    }

    try {
      await api.post(
        "/createReview",
        {
          feedback,
          decision,
          paperId: paper.id,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Review submitted successfully!");
      navigate("/reviewer");
    } catch (err) {
      console.log("Error while submitting review:", err);
      alert("Could not submit review.");
    }
  };

  return (
    <div className="addReviewWrapper">
      <Header
        userName={name}
        tabs={[{ label: "Dashboard", to: "/reviewer" }]}
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
  );
}
