let teams = [];
let doubleElimination = false;

function generateBracket() {
  const file = document.getElementById("uploadCSV").files[0];
  if (!file) {
    alert("Please upload a CSV file with team names.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    teams = e.target.result.trim().split(/\r?\n/).filter(Boolean);
    if (teams.length < 2 || teams.length > 128) {
      alert("Enter between 2 and 128 teams.");
      return;
    }
    buildBracket(teams);
  };
  reader.readAsText(file);
}

function buildBracket(teamList) {
  const bracket = document.getElementById("bracket");
  bracket.innerHTML = "";

  let currentRound = teamList.map(name => createMatchElement(name, ""));
  let roundNumber = 1;

  while (currentRound.length > 1) {
    const nextRound = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const teamA = currentRound[i] || createMatchElement("", "");
      const teamB = currentRound[i + 1] || createMatchElement("", "");
      const match = document.createElement("div");
      match.className = "match";
      match.appendChild(teamA);
      match.appendChild(teamB);
      bracket.appendChild(match);
      nextRound.push(createMatchElement("", ""));
    }
    currentRound = nextRound;
    roundNumber++;
  }

  if (doubleElimination) {
    const sep = document.createElement("hr");
    bracket.appendChild(sep);
    const loserText = document.createElement("p");
    loserText.textContent = "Loser's Bracket (double elimination)";
    bracket.appendChild(loserText);
  }
}

function createMatchElement(teamA, teamB) {
  const template = document.getElementById("match-template");
  const clone = template.content.cloneNode(true);
  clone.querySelectorAll(".team-name")[0].textContent = teamA;
  clone.querySelectorAll(".team-name")[1].textContent = teamB;
  return clone;
}

function advanceTeam(element) {
  const name = element.querySelector(".team-name").textContent;
  alert("Advanced: " + name);
}

function exportToPDF() {
  const bracket = document.getElementById("bracket");
  html2canvas(bracket).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("l", "pt", "a4");
    const scale = 750 / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, canvas.width * scale, canvas.height * scale);
    pdf.save("bracket.pdf");
  });
}

function toggleDoubleElimination() {
  doubleElimination = !doubleElimination;
  if (teams.length) buildBracket(teams);
}
