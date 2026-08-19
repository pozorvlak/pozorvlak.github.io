const criminality = {
    'A1': 'criminal',
    'B1': 'criminal',
    'C1': 'innocent',
    'A2': 'criminal',
    'B2': 'innocent',
    'C2': 'criminal',
    'A3': 'innocent',
    'B3': 'innocent',
    'C3': 'criminal',
};

const deps = {
    'A1': ['B2', 'C2', 'A2'],
    'B1': ['A2'],
    'C1': ['B2', 'C2', 'A2'],
    'A2': ['C2'],
    'B2': ['B1'],
    'C2': [],
    'A3': ['B2', 'C2', 'A2'],
    'B3': ['B1'],
    'C3': ['B2'],
};

var currentSuspect;
var unsolved;
var incorrect = 0;
var unjustified = 0;

function onClick() {
    currentSuspect = this;
    var dialog = document.getElementById('jaccuse');
    document.getElementById('emoji').innerText = this.children[0].innerText;
    document.getElementById('name').innerText  = this.children[1].innerText;
    document.getElementById('job').innerText   = this.children[2].innerText;
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
    if (guilt != criminality[currentSuspect.id]) {
        document.getElementById('jaccuse').close();
        document.getElementById('disallowed').showModal();
        incorrect++;
        return;
    }
    for (const dep of deps[currentSuspect.id]) {
        if (document.getElementById(dep).classList.contains('unknown')) {
            document.getElementById('jaccuse').close();
            document.getElementById('disallowed').showModal();
            unjustified++;
            return;
        }
    }
    currentSuspect.classList.remove('unknown');
    currentSuspect.classList.add(criminality[currentSuspect.id]);
    currentSuspect.removeEventListener('click', onClick);
    document.getElementById('jaccuse').close();
    if (--unsolved == 0) {
        success();
    }
}

function criminal() {
    accuse("criminal");
}

function innocent() {
    accuse("innocent");
}

function cancel() {
    document.getElementById('jaccuse').close();
}

function closeDisallowed() {
    document.getElementById('disallowed').close();
}

window.onload = function() {
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

