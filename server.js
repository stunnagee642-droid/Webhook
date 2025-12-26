const express = require("express");
const multer = require("multer");
const unzipper = require("unzipper");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use("/sites", express.static("sites"));

const upload = multer({ dest: "uploads/" });

app.post("/deploy", upload.single("zip"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No ZIP uploaded" });

  const siteId = uuid().slice(0, 8);
  const sitePath = path.join(__dirname, "sites", siteId);

  fs.mkdirSync(sitePath, { recursive: true });

  fs.createReadStream(req.file.path)
    .pipe(unzipper.Extract({ path: sitePath }))
    .on("close", () => {
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        url: `/sites/${siteId}/`
      });
    });
});

app.listen(PORT, () =>
  console.log(`🚀 WEBHOOK running on port ${PORT}`)
);
