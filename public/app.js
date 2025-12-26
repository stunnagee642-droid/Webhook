function updateURL() {
  const name = document.getElementById("appName").value || "your-app-name";
  document.getElementById("urlPreview").innerText =
    `https://host.webhook.online/${name}`;
}

function selectTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add("active");
  document.getElementById(tab).classList.add("active");
}
