let superheroes = [];
let filteredHeroes = [];
let currentPage = 1;
let pageSize = 20;
let sortOrder = { column: "name", direction: "asc" };

fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json())
  .then((data) => {
    superheroes = data;
    filteredHeroes = superheroes;
    startaffiche();
  })
  .catch((err) => {
    console.log(err);
  });

function formatPowerstats(powerstats) {
  return Object.entries(powerstats)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

const searchInput = document.getElementById("search");
const pageSizeSelect = document.getElementById("pageSize");

searchInput.addEventListener("input", updateSearch);
pageSizeSelect.addEventListener("change", updatePageSize);

function updateSearch() {
  const chose = document.getElementById("chose").value;
  const query = searchInput.value.toLowerCase();

  filteredHeroes = superheroes.filter((hero) => {
    
    let valeur = "";

    // Get the value of the selected field
    switch (chose) {
      case "name":
        valeur = hero.name;
        break;
      case "fullName":
        valeur = hero.biography.fullName;
        break;
      case "race":
        valeur = hero.appearance.race;
        break;
      case "gender":
        valeur = hero.appearance.gender;
        break;
      case "placeOfBirth":
        valeur = hero.biography.placeOfBirth;
        break;
      case "alignment":
        valeur = hero.biography.alignment;
        break;
      default:
        valeur = "";
    }
    console.log('valeu :','/',valeur,'/', valeur.toLowerCase().includes(query),'/',query)
    return valeur && valeur.toLowerCase().includes(query);
    console.log(filteredHeroes,'after filter :')
  });

  currentPage = 1;
  startaffiche();
}

function updatePageSize() {
  pageSize =
    pageSizeSelect.value === "all"
      ? filteredHeroes.length
      : parseInt(pageSizeSelect.value, 10);
  currentPage = 1;
  startaffiche();
}

function startaffiche() {
  const tbody = document.querySelector("#superheroTable tbody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedHeroes = filteredHeroes.slice(start, end);

  paginatedHeroes.forEach((hero) => {
    const row = tbody.insertRow();
    row.innerHTML = `
            <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
            <td>${hero.name}</td>
            <td>${hero.biography.fullName || "-"}</td>
            <td>${Object.entries(hero.powerstats)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}</td>
            <td>${hero.appearance.race || "-"}</td>
            <td>${hero.appearance.gender || "-"}</td>
            <td>${hero.appearance.height.join(", ") || "-"}</td>
            <td>${hero.appearance.weight.join(", ") || "-"}</td>
            <td>${hero.biography.placeOfBirth || "-"}</td>
            <td>${hero.biography.alignment || "-"}</td>
        `;
    row.addEventListener("click", () => showDetailView(hero));
  });

  updatePaginationControls();
}

document.querySelectorAll("th").forEach((header) => {
  header.addEventListener("click", () => sortTable(header.dataset.column));
});

function sortTable(column) {
  const direction =
    sortOrder.column === column && sortOrder.direction === "asc"
      ? "desc"
      : "asc";
  sortOrder = { column, direction };

  filteredHeroes.sort((a, b) => {
    let argA, argB;

    switch (column) {
      case "name":
        argA = a.name || "-";
        argB = b.name || "-";
        break;
      case "fullName":
        argA = a.biography.fullName || "-";
        argB = b.biography.fullName || "-";
        break;
      case "gender":
        argA = a.appearance.gender || "-";
        argB = b.appearance.gender || "-";
        break;
      case "alignment":
        argA = a.biography.alignment || "-";
        argB = b.biography.alignment || "-";
        break;
      case "placeOfBirth":
        argA = a.biography.placeOfBirth || "-";
        argB = b.biography.placeOfBirth || "-";
        break;
      case "race":
        argA = a.appearance.race || "-";
        argB = b.appearance.race || "-";
        break;
      case "height":
        argA = convertHeightToCm(a.appearance.height);
        argB = convertHeightToCm(b.appearance.height);
        break;
      case "weight":
        argA = convertWeightToKg(a.appearance.weight);
        argB = convertWeightToKg(b.appearance.weight);
        break;
      case "powerstats":
        argA = Object.values(a.powerstats).reduce(
          (sum, curr) => sum + (curr || 0),
          0
        );
        argB = Object.values(b.powerstats).reduce(
          (sum, curr) => sum + (curr || 0),
          0
        );
        break;
      default:
        argA = a[column] || "-";
        argB = b[column] || "-";
    }

    // Handle missing values to always be sorted last
    const isMissingA = argA === "-" || argA === "" || argA === 0;
    const isMissingB = argB === "-" || argB === "" || argB === 0;

    if (isMissingA && !isMissingB) return 1;
    if (!isMissingA && isMissingB) return -1;

    // Perform the comparison based on the sort direction
    if (argA < argB) return direction === "asc" ? -1 : 1;
    if (argA > argB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  startaffiche();
}

function showDetailView(hero) {
  const detailView = document.getElementById("detailView");
  detailView.innerHTML = `
          <h2>${hero.name}</h2>
        <img src="${hero.images.lg}" alt="${hero.name}">
        <p><strong>Full Name:</strong> ${hero.biography.fullName || "-"}</p>
        <p><strong>Aliases:</strong> ${
          hero.biography.aliases.join(", ") || "-"
        }</p>
        <p><strong>Place of Birth:</strong> ${
          hero.biography.placeOfBirth || "-"
        }</p>
        <p><strong>First Appearance:</strong> ${
          hero.biography.firstAppearance || "-"
        }</p>
        <p><strong>Publisher:</strong> ${hero.biography.publisher || "-"}</p>
        <p><strong>Alignment:</strong> ${hero.biography.alignment || "-"}</p>

        <h3>Powerstats</h3>
        <p>${formatPowerstats(hero.powerstats)}</p>

        <h3>Appearance</h3>
        <p><strong>Gender:</strong> ${hero.appearance.gender || "-"}</p>
        <p><strong>Race:</strong> ${hero.appearance.race || "-"}</p>
        <p><strong>Height:</strong> ${
          hero.appearance.height.join(", ") || "-"
        }</p>
        <p><strong>Weight:</strong> ${
          hero.appearance.weight.join(", ") || "-"
        }</p>
        <p><strong>Eye Color:</strong> ${hero.appearance.eyeColor || "-"}</p>
        <p><strong>Hair Color:</strong> ${hero.appearance.hairColor || "-"}</p>

        <h3>Work</h3>
        <p><strong>Occupation:</strong> ${hero.work.occupation || "-"}</p>
        <p><strong>Base:</strong> ${hero.work.base || "-"}</p>

        <h3>Connections</h3>
        <p><strong>Group Affiliations:</strong> ${
          hero.connections.groupAffiliation || "-"
        }</p>
        <p><strong>Relatives:</strong> ${hero.connections.relatives || "-"}</p>

        <button onclick="hideDetailView()">Close</button>
    `;
  detailView.classList.remove("hidden");
}

function hideDetailView() {
  document.getElementById("detailView").classList.add("hidden");
}

function updatePaginationControls() {
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = "";

  const totalPages = Math.ceil(filteredHeroes.length / pageSize);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.toggle("active", i === currentPage);
    button.addEventListener("click", () => {
      currentPage = i;
      startaffiche();
    });
    paginationControls.appendChild(button);
  }
}

function convertHeightToCm(heightArray) {
  if (!heightArray || heightArray.length === 0) return 0;
  const metricValue = heightArray.find(
    (h) => h.includes("cm") || h.includes("meters")
  );
  if (metricValue) {
    const numericValue = parseFloat(metricValue);
    return metricValue.includes("meters") ? numericValue * 100 : numericValue;
  }
  const imperialValue = heightArray.find((h) => h.includes("'"));
  if (imperialValue) {
    const [feet, inches = 0] = imperialValue
      .split("'")
      .map((num) => parseFloat(num) || 0);
    return Math.round(feet * 30.48 + inches * 2.54);
  }
  return 0;
}

function convertWeightToKg(weightArray) {
  if (!weightArray || weightArray.length === 0) return 0;
  const metricValue = weightArray.find((w) => w.includes("kg"));
  if (metricValue) {
    return parseFloat(metricValue);
  }
  const imperialValue = weightArray.find((w) => w.includes("lb"));
  if (imperialValue) {
    const pounds = parseFloat(imperialValue);
    return Math.round(pounds * 0.453592);
  }
  return 0;
}
