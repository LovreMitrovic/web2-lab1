function refreshLeaderboard(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${window.location.pathname}/leaderboard`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseURL)
            console.log(xhr.responseText);
            document.getElementById("leaderboard").outerHTML = xhr.responseText;
        } else {
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
        } else if (xhr.status === 403){
            alert("You must be the owner of this competition to do this");
        }else {
            console.error(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({outcome}));
}