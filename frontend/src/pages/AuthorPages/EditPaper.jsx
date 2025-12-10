import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosConfig";
import { TextField, Button, MenuItem } from "@mui/material";
import "./AddPaper.css";

export default function EditPaper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [conferenceId, setConferenceId] = useState("");
  const [file, setFile] = useState(null);
  const [conferences, setConferences] = useState([]);
  const [existingFileUrl, setExistingFileUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const confRes = await api.get("/Conferences");
        setConferences(confRes.data);

        const paperRes = await api.get(
          `/PapersByAuthor/${JSON.parse(localStorage.getItem("user")).id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const paper = paperRes.data.find((p) => p.id === Number(id));

        setTitle(paper.title);
        setConferenceId(paper.conferenceId);
        setExistingFileUrl(paper.fileUrl);
      } catch (err) {
        console.log("Error loading paper:", err);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("conferenceId", conferenceId);

      if (file) formData.append("file", file);

      await api.put(`/updatePaper/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/author");
    } catch (err) {
      alert("Error updating paper.");
    }
  };

  return (
    <div className="addPaperWrapper">
      <div className="addPaperCard">
        <h1 className="addPaperTitle">Edit Paper</h1>

        <label className="label">Paper title</label>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="label">Conference</label>
        <TextField
          select
          fullWidth
          size="small"
          value={conferenceId}
          onChange={(e) => setConferenceId(e.target.value)}
        >
          {conferences.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.title}
            </MenuItem>
          ))}
        </TextField>

        <label className="label">Current file</label>
        {existingFileUrl && (
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noreferrer"
            className="tableLink"
          >
            View Current PDF
          </a>
        )}

        <label className="label">Change file (optional)</label>
        <div id="fileInputDiv">
          <input
            type="file"
            accept="application/pdf"
            className="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <div className="filePreview"> {file.name}</div>}
        </div>

        <Button
          variant="contained"
          className="btnSubmit"
          onClick={handleUpdate}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
