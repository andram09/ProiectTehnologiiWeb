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
      } catch (err) {
        console.log(`Error while fetching meetings: ${err}`);
      }
    }
    fetchConferences();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!title || !conferenceId || !file) {
        alert("All fields are required!!");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("conferenceId", conferenceId);
      formData.append("file", file);

      console.log("DATA TRIMISA:", {
        title,
        conferenceId,
        file,
      });

      await api.post(`./createPaper`, {
        title: title,
        conferenceId: conferenceId,
        file: file,
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
              {conf.name}
            </MenuItem>
          ))}
        </TextField>

        <label className="label">Paper file</label>
        <input
          type="file"
          accept="application/pdf"
          className="fileInput"
          onChange={(e) => setFile(e.target.files[0])}
        />

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
