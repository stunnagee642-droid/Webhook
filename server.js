const express = require("express");
const multer = require("multer");
const unzipper = require("unzipper");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const upload = multer({ dest: "uploads/" });

/* ========= API ROUTES ========= */

// HEALTH CHECK (IMPORTANT)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// DEPLOY HTML
app.post("/deploy/html", (req, res) => {
  console.log("▶ /deploy/html hit");

  const { appName, html } = req.body;

  if (!appName || !html) {
    return res.status(400).json({ error: "Missing appName or html" });
  }

  const appPath = path.join(__dirname, "apps", appName);
  fs.mkdirSync(appPath, { recursive: true });

  fs.writeFileSync(path.join(appPath, "index.html"), html);

  console.log(`✅ HTML deployed: ${appName}`);

  res.json({
    success: true,
    url: `/apps/${appName}/`
  });
});

// DEPLOY ZIP
app.post("/deploy/zip", upload.single("zip"), async (req, res) => {
  console.log("▶ /deploy/zip hit");

  const appName = req.body.appName;

  if (!req.file || !appName) {
    return res.status(400).json({ error: "Missing ZIP or appName" });
  }

  const appPath = path.join(__dirname, "apps", appName);
  fs.mkdirSync(appPath, { recursive: true });

  await fs.createReadStream(req.file.path)
    .pipe(unzipper.Extract({ path: appPath }))
    .promise();

  fs.unlinkSync(req.file.path);

  console.log(`✅ ZIP deployed: ${appName}`);

  res.json({
    success: true,
    url: `/apps/${appName}/`
  });
});

/* ========= STATIC FILES (LAST) ========= */

app.use("/apps", express.static("apps"));
app.use(express.static("public"));

/* ========= START ========= */

app.listen(PORT, () => {
  console.log(`🚀 WEBHOOK running on port ${PORT}`);
});
