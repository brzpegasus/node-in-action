var fs = require('fs'),
    completedTasks = 0,
    tasks = [],
    wordCounts = {},
    filesDir = './text';

function checkIfComplete() {
    // When all tasks have completed, display each word used in the files and
    // how many times it was used.
    completedTasks++;
    if (completedTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(index + ': ' + wordCounts[index]);
        }
    }
}

function countWordsInText(text) {
    var words = text.toString().toLowerCase().split(/\W+/).sort();
    for (var index in words) {
        var word = words[index];
        if (word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

// Get a list of the files in the "text" directory
fs.readdir(filesDir, function(err, files) {
    if (err) throw err;

    for (var index in files) {
        // Define a task to handle each file. Each task includes a call to
        // asynchronously read the file then count the file's word usage.
        var task = (function(file) {
            return function() {
                fs.readFile(file, function(err, text) {
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(filesDir + '/' + files[index]);
        tasks.push(task);
    }

    for (var task in tasks) {
        tasks[task]();
    }
});
