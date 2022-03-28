function hide(exclude) {
    //List of divs
    let thingsToHide = [
        "title",
        "profile",
        "get-name",
    ];
    //For each div
    for (let i = 0; i < thingsToHide.length; i++) {
        //If passed as a parameter, show it
        if (exclude.includes(thingsToHide[i])) {
            $("#" + thingsToHide[i]).show()
        }
        //Otherwise, hide it
        else {
            $("#" + thingsToHide[i]).hide();
        }
    };
}

function updateSlider(val) {
    //Get value
    $("#sliderValue").html(val);
    //Get minutes/seconds
    timerMinutes = Math.floor(val / 60);
    timerSeconds = val % 60;
    //If timer seconds under 10, add a zero
    if (timerSeconds < 10) timerSeconds = "0" + String(timerSeconds);
    timerText = timerMinutes + ":" + timerSeconds;
    //Put in HTML
    $("#sliderValue").html(timerText);
}

$("#create-button").click(() => hide("get-name"));
$("#profile-button").click(() => hide("profile"));
$("#back-button").click(() => hide("title"));

$("#go").click(() => {
    //Get values from form
    var p1Name = $("#p1Name").val();
    var p2Name = $("#p2Name").val();
    var timer = $("#timer").val();
    //Put in local storage
    localStorage.p1Name = p1Name;
    localStorage.p2Name = p2Name;
    localStorage.timer = timer;
    //Check length of names
    if (p1Name.length < 2 || p2Name.length < 2 || p1Name.length > 12 || p2Name.length > 12) {
        $("#error").html("You need to enter a value for both names that is between 2 and 12 characters (inclusive)");
    }
    else if (p1Name.match(/[|\\/~^:,;?!&%$@*+]/) || p2Name.match(/[|\\/~^:,;?!&%$@*+]/)) {
        $("#error").html("Names cannot include symbols.");
    }
    //If names are input, go to the game
    else {
        window.location.href = "./game.html";
    }
})

hide(["title"]);
