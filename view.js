const $ = require("jquery")
const fs = require("fs")

let filename = "match-history"

$("#profile-button").click(() => {
	loadMatches()
})

function loadMatches() {
	if (fs.existsSync(filename)) {
		let data = fs.readFileSync(filename, "utf8").split("\n")
		//Add to table
	}
	else {
		console.log("Uh oh spaghettio, file doesn't exist!")
		console.log("Making a new file...")
		fs.writefile(filename, "", (err) => {
			if (err) { console.log(err) }
		})
	}
}
