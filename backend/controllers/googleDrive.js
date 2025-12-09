import fs from "fs";
import { google } from "googleapis";

import apikeys from "../keys/service-account.json" with { type: "json" };
// import apikeys from "../keys/service-account.json";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

export async function authorize() {
  const auth = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPES
  );
  try {
    await auth.authorize();
    return auth;
  } catch (err) {
    throw new Error(`Error authorizing Google Drive API: ${err.message}`);
  }
}

export async function listFiles(auth) {
  const drive = google.drive({ versions: "v3", auth });

  try {
    const response = await drive.files.list({
      pagSize: 10,
      fields: "nextPageToken,files(id,name)",
    });
    const files = response.data.files;
    if (files.length) {
      console.log("Available files: ");
      files.forEach((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log("No files found");
    }
  } catch (err) {
    throw new Error(`Error listening files in Google Drive: ${err.message}`);
  }
}

export async function uploadFile(auth, filePath, folderId) {
  const drive = google.drive({ version: "v3", auth });

  const fileMetaData = { name: filePath.split("/").pop(), parents: [folderId] };

  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
      fields: "id, webViewLink",
    });
    console.log("File uploaded succesfully. File id: ", response.data.id);
    return response.data;
  } catch (err) {
    throw new Error(`Error uploading files to Google Drive: ${err.message}`);
  }
}
