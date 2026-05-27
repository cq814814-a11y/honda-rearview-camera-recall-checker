const modelsByMake = {
  honda: [
    "Prologue",
    "Odyssey",
    "Pilot",
    "Passport",
    "Ridgeline",
    "CR-V",
    "Accord",
    "Civic",
    "HR-V",
    "Insight"
  ],
  acura: ["ZDX", "RDX", "MDX", "TLX", "ILX", "NSX"]
};

const cameraTerms = [
  "rearview camera",
  "rear view camera",
  "rear visibility",
  "rearview mirrors",
  "back over prevention",
  "blank image",
  "distorted image",
  "camera",
  "display"
];

const form = document.querySelector("#recall-form");
const yearSelect = document.querySelector("#year");
const makeSelect = document.querySelector("#make");
const modelSelect = document.querySelector("#model");
const vinInput = document.querySelector("#vin");
const results = document.querySelector("#results");

function initYears() {
  const currentYear = 2026;
  for (let year = currentYear; year >= 2010; year -= 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.append(option);
  }
  yearSelect.value = "2024";
}

function initModels() {
  const make = makeSelect.value;
  modelSelect.textContent = "";
  modelsByMake[make].forEach((model) => {
    const option = document.createElement("option");
    option.value = model.toLowerCase();
    option.textContent = model;
    modelSelect.append(option);
  });
  modelSelect.value = make === "honda" ? "prologue" : "zdx";
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function isCameraRelated(recall) {
  const haystack = normalize(
    [
      recall.Component,
      recall.Summary,
      recall.Consequence,
      recall.Remedy,
      recall.NHTSACampaignNumber
    ].join(" ")
  );
  return cameraTerms.some((term) => haystack.includes(term));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanVin(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function nhtsaVinUrl(vin) {
  const clean = cleanVin(vin);
  return clean.length === 17
    ? `https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(clean)}`
    : "https://www.nhtsa.gov/recalls";
}

function campaignUrl(campaignNumber) {
  return `https://api.nhtsa.gov/recalls/campaignNumber?campaignNumber=${encodeURIComponent(
    campaignNumber
  )}`;
}

function renderLoading(make, model, year) {
  results.innerHTML = `
    <div class="result-head">
      <span class="status warn">Checking NHTSA</span>
      <h2>${escapeHtml(year)} ${escapeHtml(make)} ${escapeHtml(model)}</h2>
      <p>Searching public recall records for rearview camera and rear visibility matches.</p>
    </div>
  `;
}

function renderError(message) {
  results.innerHTML = `
    <div class="result-head">
      <span class="status warn">Could not check</span>
      <h2>NHTSA request failed</h2>
      <p>${escapeHtml(message)}</p>
      <div class="result-actions">
        <a class="result-link" href="https://www.nhtsa.gov/recalls" target="_blank" rel="noreferrer">Check on NHTSA.gov</a>
      </div>
    </div>
  `;
}

function renderRecallCard(recall) {
  const campaign = escapeHtml(recall.NHTSACampaignNumber || "NHTSA campaign");
  const component = escapeHtml(recall.Component || "Component not listed");
  const date = escapeHtml(recall.ReportReceivedDate || "Date not listed");
  const summary = escapeHtml(recall.Summary || "Summary not available.");
  const consequence = escapeHtml(recall.Consequence || "Consequence not available.");
  const remedy = escapeHtml(recall.Remedy || "Remedy not available.");

  return `
    <article class="recall-card">
      <div class="meta-row">
        <span class="tag">${campaign}</span>
        <span class="tag">${date}</span>
        <span class="tag">${component}</span>
      </div>
      <h3>${component}</h3>
      <p><strong>Summary:</strong> ${summary}</p>
      <p><strong>Risk:</strong> ${consequence}</p>
      <p><strong>Remedy:</strong> ${remedy}</p>
      <div class="result-actions">
        <a class="result-link" href="${campaignUrl(
          recall.NHTSACampaignNumber
        )}" target="_blank" rel="noreferrer">Open campaign JSON</a>
      </div>
    </article>
  `;
}

function renderResults({ make, model, year, recalls, cameraRecalls, vin }) {
  const vinUrl = nhtsaVinUrl(vin);
  const displayName = `${year} ${make.toUpperCase()} ${model.toUpperCase()}`;
  const hasCameraMatches = cameraRecalls.length > 0;
  const statusClass = hasCameraMatches ? "match" : "clear";
  const statusText = hasCameraMatches
    ? `${cameraRecalls.length} camera-related match${cameraRecalls.length === 1 ? "" : "es"}`
    : "No camera match found";
  const lead = hasCameraMatches
    ? `NHTSA records for ${displayName} include recall text related to a camera, rear visibility, display, or back-over prevention issue.`
    : `No camera-related recall text was found in NHTSA records for ${displayName}. Use the official VIN lookup to verify exact open recall status.`;

  const cards = (hasCameraMatches ? cameraRecalls : recalls.slice(0, 5))
    .map(renderRecallCard)
    .join("");

  const fallbackNote =
    !hasCameraMatches && recalls.length > 0
      ? `<p>NHTSA returned ${recalls.length} recall record${recalls.length === 1 ? "" : "s"} for this vehicle. Showing the first few non-camera records below for context.</p>`
      : "";

  const emptyNote =
    recalls.length === 0
      ? `<p>NHTSA returned no recall records for this exact year, make, and model combination.</p>`
      : "";

  results.innerHTML = `
    <div class="result-head">
      <span class="status ${statusClass}">${statusText}</span>
      <h2>${escapeHtml(displayName)}</h2>
      <p>${escapeHtml(lead)}</p>
      ${fallbackNote}
      ${emptyNote}
      <div class="result-actions">
        <a class="result-link" href="${vinUrl}" target="_blank" rel="noreferrer">Verify with NHTSA VIN lookup</a>
        <a class="result-link" href="https://www.nhtsa.gov/recalls" target="_blank" rel="noreferrer">Search NHTSA recalls</a>
      </div>
    </div>
    <div class="recall-results">${cards}</div>
  `;
}

async function checkRecalls(make, model, year, vin) {
  renderLoading(make, model, year);
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(
    make
  )}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`NHTSA returned HTTP ${response.status}.`);
  }
  const payload = await response.json();
  const recalls = Array.isArray(payload.results) ? payload.results : [];
  const cameraRecalls = recalls.filter(isCameraRelated);
  renderResults({ make, model, year, recalls, cameraRecalls, vin });
}

function submitCurrent() {
  const make = makeSelect.value;
  const model = modelSelect.value;
  const year = yearSelect.value;
  const vin = cleanVin(vinInput.value);
  checkRecalls(make, model, year, vin).catch((error) => {
    renderError(error.message || "Please try again later.");
  });
}

function applyPreset(value) {
  const [make, model, year] = value.split("|");
  makeSelect.value = make;
  initModels();
  modelSelect.value = model;
  yearSelect.value = year;
  submitCurrent();
}

makeSelect.addEventListener("change", initModels);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCurrent();
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

vinInput.addEventListener("input", () => {
  vinInput.value = cleanVin(vinInput.value);
});

initYears();
initModels();
