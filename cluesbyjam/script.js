const puzzle = [
    [
        {
            "id": "A1",
            "start": false,
            "emoji": "🧕",
            "name": "Alia",
            "job": "topologist",
            "clue": "Milton Keynes is lovely in November!",
            "criminal": true,
            "deps": ["B2", "C2", "A2"]
        }, {
            "id": "B1",
            "start": false,
            "emoji": "🥸",
            "name": "Bruno",
            "job": "noncommutative geometer",
            "clue": "There are a prime number of innocents in column B",
            "criminal": true,
            "deps": ["A2"]
        }, {
            "id": "C1",
            "start": false,
            "emoji": "👱‍♀️",
            "name": "Claudia",
            "job": "combinatorialist",
            "clue": "My favourite part of MathsJam is seeing my friends!",
            "criminal": false,
            "deps": ["B2", "C2", "A2"]
        }
    ], [
        {
            "id": "A2",
            "start": false,
            "emoji": "😸",
            "name": "Derek",
            "job": "category theorist",
            "clue": "The two criminals in row 1 are connected",
            "criminal": true,
            "deps": ["C2"]
        }, {
            "id": "B2",
            "start": false,
            "emoji": "👩‍🚀",
            "name": "Eilidh",
            "job": "algebraic number theorist",
            "clue": "Iorwerth is one of two criminals in a corner",
            "criminal": false,
            "deps": ["B1"]
        }, {
            "id": "C2",
            "start": true,
            "emoji": "🕵️‍♂️",
            "name": "Fearghas",
            "job": "cryptologist",
            "clue": "Derek is one of two criminals in column A",
            "criminal": true,
            "deps": []
        }
    ], [
        {
            "id": "A3",
            "start": false,
            "emoji": "🪢",
            "name": "Gosia",
            "job": "knot theorist",
            "clue": "My favourite part of MathsJam is eating cake!",
            "criminal": false,
            "deps": ["B2", "C2", "A2"]
        }, {
            "id": "B3",
            "start": false,
            "emoji": "👨‍🏫",
            "name": "Henry",
            "job": "mathematical physicist",
            "clue": "My favourite part of MathsJam is the competition competition competition competition!",
            "criminal": false,
            "deps": ["B1"]
        }, {
            "id": "C3",
            "start": false,
            "emoji": "🧲",
            "name": "Iorwerth",
            "job": "magnetohydrodynamicist",
            "clue": "Who ever heard of a criminal mathematician?",
            "criminal": true,
            "deps": ["B2"]
        }
    ]
];

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
    if (guilt != currentSuspect.criminal) {
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
    card.classList.add(currentSuspect.criminal ? "criminal" : "innocent");
    card.removeEventListener('click', onClick);
    document.getElementById('jaccuse').close();
    if (--unsolved == 0) {
        success();
    }
}

function criminal() {
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

function buildSuspectTable() {
    let table = document.getElementById('suspects');
    let tableText = "";
    for (const row of puzzle) {
        let rowText = "<tr>\n";
        for (const suspect of row) {
            let className = suspect.start ? (suspect.criminal ? "criminal" : "innocent") : "unknown";
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

window.onload = function() {
    buildSuspectTable();
    var unknownEntries = document.querySelectorAll('td.unknown');
    unsolved = unknownEntries.length;
    for (const td of unknownEntries) {
        td.addEventListener('click', onClick);
    }
    document.getElementById('criminal').addEventListener('click', criminal);
    document.getElementById('innocent').addEventListener('click', innocent);
    document.getElementById('cancel').addEventListener('click', cancel);
    document.getElementById('closeDisallowed').addEventListener('click', closeDisallowed);
};

