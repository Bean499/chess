function hide(exclude) {
    //Hide everything on startup
    let thingsToHide = [
        "title",
        "in-game",
        "join-lobby",
        "create-lobby",
        "lobby",
        "profile",
        "get-name",
    ];

    if (!Array.isArray(exclude)) {
        exclude = [exclude]
    }

    for (let i = 0; i < thingsToHide.length; i++) {
        if (exclude.includes(thingsToHide[i])) {
            $("#" + thingsToHide[i]).show()
        }
        else {
            $("#" + thingsToHide[i]).hide();
        }
    };
}

function matchUpdate() {
    console.log();
}

$("#create-button").click(() => hide("get-name"));
$("#join-button").click(() => hide("join-lobby"));
$("#profile-button").click(() => {
    hide("profile");
    matchUpdate();
});
$("#back-button").click(() => hide("title"));
$("#go").click(() => {
    var p1Name = $("#p1Name").val();
    var p2Name = $("#p2Name").val();
    var timer = $("#timer").val();
    localStorage.p1Name = p1Name;
    localStorage.p2Name = p2Name;
    localStorage.timer = timer;
    if (p1Name.length <= 0 || p2Name.length <= 0) {
        $("#error").html("You need to enter a value for both names!");
    }
    else {
        window.location.href = "./game.html";
    }
})

hide(["title"]);