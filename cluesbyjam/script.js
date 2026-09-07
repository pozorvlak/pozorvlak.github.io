var suspects = {};
var currentSuspect;
var unsolved;
var incorrect = 0;
var unjustified = 0;

function onClick() {
    currentSuspect = suspects[this.id];
    var dialog = document.getElementById('jaccuse');
    document.getElementById('emoji').innerText = currentSuspect.emoji;
    document.getElementById('name').innerText  = currentSuspect.name;
    document.getElementById('job').innerText   = currentSuspect.job;
    dialog.showModal();
};

function success() {
    console.log("Success!")
    var scoreText;
    if (incorrect == 0 && unjustified == 0) {
        scoreText = "With a perfect score, no less!";
    } else {
        scoreText = "With only " + unjustified + " unjustified moves and " + incorrect + " incorrect ones!";
    }
    document.getElementById('score').innerText = scoreText;
    document.getElementById('success').showModal();
}

function accuse(guilt) {
    if (guilt != currentSuspect.guilty) {
        document.getElementById('jaccuse').close();
        document.getElementById('disallowed').showModal();
        incorrect++;
        return;
    }
    for (const dep of currentSuspect.deps) {
        if (document.getElementById(dep).classList.contains('unknown')) {
            document.getElementById('jaccuse').close();
            document.getElementById('disallowed').showModal();
            unjustified++;
            return;
        }
    }
    let card = document.getElementById(currentSuspect.id);
    card.classList.remove('unknown');
    card.classList.add(currentSuspect.guilty ? "guilty" : "innocent");
    card.removeEventListener('click', onClick);
    document.getElementById('jaccuse').close();
    if (--unsolved == 0) {
        success();
    }
}

function guilty() {
    accuse(true);
}

function innocent() {
    accuse(false);
}

function cancel() {
    document.getElementById('jaccuse').close();
}

function closeDisallowed() {
    document.getElementById('disallowed').close();
}

function buildSuspectTable(puzzle) {
    let table = document.getElementById('suspects');
    let tableText = "";
    let numCols = puzzle[0].length;
    let headerRow = "<tr><th scope='col' style='width: 1em'></th>\n";
    for (let col of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, numCols)) {
        headerRow += `<th scope='col'>${col}</th>\n`;
    }
    headerRow += "</tr>\n";
    tableText += headerRow;
    var rowID = 1;
    for (const row of puzzle) {
        let rowText = `<tr>\n<th scope='row'>${rowID++}</th>\n`;
        for (const suspect of row) {
            let className = suspect.start ? (suspect.guilty ? "guilty" : "innocent") : "unknown";
            rowText +=  `<td id=${suspect.id} class=${className}>\n`;
            for (const prop of ["emoji", "name", "job", "clue"]) {
                rowText += `<div class="${prop}">${suspect[prop]}</div>\n`
            }
            rowText += "</td>";
            suspects[suspect.id] = suspect;
        }
        rowText += "</tr>";
        tableText += rowText;
    }
    table.innerHTML = tableText;
}

function renderPuzzle(puzzle) {
    buildSuspectTable(puzzle);
    var unknownEntries = document.querySelectorAll('td.unknown');
    unsolved = unknownEntries.length;
    for (const td of unknownEntries) {
        td.addEventListener('click', onClick);
    }
    document.getElementById('guilty').addEventListener('click', guilty);
    document.getElementById('innocent').addEventListener('click', innocent);
    document.getElementById('cancel').addEventListener('click', cancel);
    document.getElementById('closeDisallowed').addEventListener('click', closeDisallowed);
}

function loadPuzzle(puzzleName) {
    const jsonFile = 'puzzles/' + puzzleName + '.json';
    console.log('Loading JSON file ' + jsonFile);
    fetch(jsonFile)
        .then(response => response.json())
        .then(json => renderPuzzle(json));
}

window.onload = function() {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    if (searchParams.has("puzzle")) {
        loadPuzzle(searchParams.get("puzzle"));
    }
};
