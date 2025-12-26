const log = msg => {
  const el = document.getElementById("console");
  el.textContent += msg + "\n";
  el.scrollTop = el.scrollHeight;
};

function updateURL() {
  const name = document.getElementById("appName").value || "my-app";
  document.getElementById("urlPreview").innerText = `/apps/${name}`;
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

  document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add("active");
  document.getElementById(tab).classList.add("active");
}

async function deployHTML() {
  log("▶ Starting HTML deployment...");

  const appName = document.getElementById("appName").value.trim();
  const html = document.getElementById("htmlContent").value;

  if (!appName) {
    log("❌ App name is required");
    return;
  }

  if (!html) {
    log("❌ HTML content is empty");
    return;
  }

  try {
    log("📡 Sending request to server...");

    const res = await fetch("/deploy/html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appName, html })
    });

    log(`📥 Server responded: ${res.status}`);

    const data = await res.json();

    if (data.success) {
      log("✅ Deployment successful!");
      log(`🌍 Live at: ${data.url}`);
    } else {
      log("❌ Deployment failed");
    }
  } catch (err) {
    log("🔥 Network / Server error");
    log(err.toString());
  }
}

async function deployZIP() {
  log("▶ Starting ZIP deployment...");

  const appName = document.getElementById("appName").value.trim();
  const zip = document.getElementById("zipFile").files[0];

  if (!appName || !zip) {
    log("❌ App name and ZIP required");
    return;
  }

  const form = new FormData();
  form.append("appName", appName);
  form.append("zip", zip);

  try {
    const res = await fetch("/deploy/zip", {
      method: "POST",
      body: form
    });

    const data = await res.json();

    if (data.success) {
      log("✅ ZIP deployed!");
      log(`🌍 Live at: ${data.url}`);
    } else {
      log("❌ ZIP deployment failed");
    }
  } catch (err) {
    log("🔥 Server error");
    log(err.toString());
  }
}
