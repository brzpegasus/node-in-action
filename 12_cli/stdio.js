var ansi = require('ansi'),
    cursor = ansi(process.stdout),
    requiredLevel = 60;

process.stdout.write("Please enter your level: ");

// Setup stdin to emit UTF-8 strings instead of Buffers
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (data) {
  var level = parseInt(data, 10);
  if (isNaN(level)) {
    console.log("%s is not a valid number.", data);
  } else if (level < requiredLevel) {
    console.log("You must be at least level %d to enter. " +
      "Come back in %d levels.", requiredLevel, requiredLevel - level);
  } else {
    enterTheSecretDungeon();
  }
  // Close stdin after this single 'data' event
  process.stdin.pause();
});

// stdin beings in a paused state. Call resume() to start reading.
process.stdin.resume();

function enterTheSecretDungeon() {
  // Output in green text.
  // Technically, Windows's cmd.exe doesn't support ANSI escape codes.
  // Node interprets them and calls the appropriate Windows functions to change
  // text color.
  // console.log("\033[32mWelcome to The Dragon's Lair! Prepare to wipe!\033[39m");
  cursor
    .fg.green()
    .write("Welcome to ")
    .bold()
    .write("The Dragon's Lair")
    .resetBold()
    .write("! Prepare to ")
    .fg.red().bold()
    .write("wipe")
    .resetBold().fg.green()
    .write("!")
}
