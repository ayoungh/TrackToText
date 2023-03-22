import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface UploaderProps {}

const Uploader: React.FC<UploaderProps> = () => {
  const [translation, setTranslation] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;

    if (
      uploadedFile &&
      (uploadedFile.type === "audio/mpeg" ||
        uploadedFile.type === "audio/mp4" ||
        uploadedFile.type === "audio/x-m4a")
    ) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid MP3 file.");
      setFile(null);
    }
  };

  const sendToWhisper = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    try {
      const response = await axios.post("/api/transcribe", formData);
      // const response = await axios.post(
      //   "https://api.openai.com/v1/audio/transcriptions",
      //   formData,
      //   {
      //     headers: {
      //       // "Content-Type": "multipart/form-data",
      //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
      //     },
      //   }
      // );
      console.log("Whisper ASR API response:", response.data);
      setTranslation(response.data);
    } catch (error) {
      console.error("Error sending file to Whisper ASR API:", error);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert("No file selected.");
      return;
    }

    sendToWhisper(file);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mp3File">
          Upload Audio File:
          <input
            type="file"
            id="mp3File"
            accept=".mp3, audio/mpeg, .m4a, audio/mp4"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {file && (
        <div>
          <p>Selected file: {file.name}</p>
        </div>
      )}

      {translation && <div>{translation}</div>}
    </div>
  );
};

export default Uploader;
