import { TextField, Button, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "../../api/axiosConfig.js";
import "./AddPaper.css";

export default function AddPaper() {
  const [title, setTitle] = useState("");
  const [conferenceId, setConferenceId] = useState("");
  const [file, setFile] = useState(null);
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    async function fetchConferences() {
      try {
        const response = await api.get(`/Conferences`);
        setConferences(response.data);
      } catch (err) {
        console.log(`Error while fetching meetings: ${err}`);
      }
    }
    fetchConferences();
  }, []);

  const validations = () => {
    if (!title) return "Title is required";
    if (title.length < 3) return "Title must have at least 3 characters.";
    if (!/^[a-zA-Z0-9\s\-\.,!?()]+$/.test(title))
      return "Title contains invalid characters.";

    if (!conferenceId) return "Please select a conference.";

    //DE VAZUT DUPA IMPLEMENTERAE ADAUGARE FISIER
    if (!file) return "Please upload your paper (PDF).";

    if (file.type !== "application/pdf") return "File must be a PDF document.";

    if (file.size > 50 * 1024 * 1024)
      return "PDF is too large. Max size: 50 MB.";

    return null; // totul e ok
  };

  const handleSubmit = async () => {
    try {
      const error = validations();
      if (error) {
        alert(error);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("conferenceId", conferenceId);
      formData.append("file", file);

      await api.post(`/createPaper`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      window.location.href = "./";
    } catch (error) {
      alert("Error while uploading the file!");
    }
  };

  return (
    <div className="addPaperWrapper">
      <div className="addPaperCard">
        <h1 className="addPaperTitle">Add New Paper</h1>

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
          {conferences.map((conf) => (
            <MenuItem key={conf.id} value={conf.id}>
              {conf.title}
            </MenuItem>
          ))}
        </TextField>

        <label className="label">Paper file</label>
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
          onClick={handleSubmit}
        >
          Submit paper
        </Button>
      </div>
    </div>
  );
}
