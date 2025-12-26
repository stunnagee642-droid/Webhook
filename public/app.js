function updateURL() {
  const name = document.getElementById("appName").value || "my-app";
  document.getElementById("urlPreview").innerText = `/apps/${name}`;
}

function tab(t) {
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.querySelector(`[onclick="tab('${t}')"]`).classList.add("active");
  document.getElementById(t).classList.add("active");
}

async function deployHTML() {
  const appName = document.getElementById("appName").value;
  const html = document.getElementById("htmlContent").value;

  const res = await fetch("/deploy/html", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ appName, html })
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `✅ Live: <a href="${data.url}" target="_blank">${data.url}</a>`;
}

async function deployZIP() {
  const appName = document.getElementById("appName").value;
  const zip = document.getElementById("zipFile").files[0];

  const form = new FormData();
  form.append("zip", zip);
  form.append("appName", appName);

  const res = await fetch("/deploy/zip", {
    method:"POST",
    body: form
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `✅ Live: <a href="${data.url}" target="_blank">${data.url}</a>`;
}
