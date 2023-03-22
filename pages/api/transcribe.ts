import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("called api endpoint");
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const formData = new FormData();

        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value);
        });

        Object.values(files).forEach((file) => {
          formData.append(
            "file",
            fs.createReadStream(file.filepath),
            file.originalFilename
          );
        });

        const response = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
            },
          }
        );

        res.status(200).json(response.data);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
