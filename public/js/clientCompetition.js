function refreshLeaderboard(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${window.location.pathname}/leaderboard`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("leaderboard").outerHTML = xhr.responseText;
        } else if (xhr.status === 500) {
            alert("Internal server error while updating match");
        } else {
            alert("Error while refreshing leaderboard check console for more details");
            console.error(xhr.responseText);
        }
    }
    xhr.send();
}

function clientCompetition(element){
    const match_id = element.parentElement.getAttribute("match-id");
    let outcome = element.getAttribute("value");
    if (outcome === "null") {
        outcome = null;
    } else {
        outcome = parseInt(outcome);
    }
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/matches/${match_id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            element.parentElement.outerHTML = xhr.responseText;
            refreshLeaderboard();
        } else if(xhr.status === 401){
            alert("You must be logged in to do this");
        } else if (xhr.status === 403) {
            alert("You must be the owner of this competition to do this");
        } else if (xhr.status === 500) {
            alert("Internal server error while updating match");
        } else {
            alert("Error while updating match check console for more details");
            console.error(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({outcome}));
}

function deleteCompetition(element){
    const competititon_id = element.getAttribute("competition-id");
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/competitions/${competititon_id}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("competition").innerHTML = xhr.responseText;
        } else if(xhr.status === 401){
            alert("You must be logged in to do this");
        } else if (xhr.status === 403) {
            alert("You must be the owner of this competition to do this");
        } else if (xhr.status === 500) {
            alert("Internal server error while deleting competition");
        } else {
            alert("Error while deleting competition check console for more details");
            console.error(xhr.responseText);
        }
    }
    xhr.send();
}

function copyLink(){
    //copy url to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        alert("Link copied to clipboard");
    });
}