async function deploy() {
  const zip = document.getElementById("zip").files[0];
  const result = document.getElementById("result");

  if (!zip) {
    result.innerText = "Upload a ZIP file";
    return;
  }

  const form = new FormData();
  form.append("zip", zip);

  result.innerText = "Deploying...";

  const res = await fetch("/deploy", {
    method: "POST",
    body: form
  });

  const data = await res.json();

  if (data.success) {
    result.innerHTML = `
      ✅ Live!<br>
      <a href="${data.url}" target="_blank">${data.url}</a>
    `;
  } else {
    result.innerText = "Deployment failed";
  }
}
