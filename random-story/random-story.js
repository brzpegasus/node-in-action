var fs = require('fs'),
    request = require('request'),
    htmlparser = require('htmlparser');

var tasks = [
    function() {
        // Make sure that the file contain the RSS feed URLs exists
        var configFilename = './rss-feeds.txt';
        fs.exists(configFilename, function(exists) {
            if (!exists) {
                next("Create a list of RSS feeds in the file ./rss-feeds.txt");
            } else {
                next(false, configFilename);
            }
        });
    },
    function(configFilename) {
        // Read the file containing the feed URLs
        fs.readFile(configFilename, function(err, feedList) {
            if (err) {
                next(err.message);
            } else {
                feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');

                // Select a random feed
                var random = Math.floor(Math.random() * feedList.length);
                next(false, feedList[random]);
            }
        });
    },
    function(feedUrl) {
        // Use the request module to do an HTTP request for the selected feed
        request({uri: feedUrl}, function(err, response, body) {
            if (err) {
                next(err.message);
            } else if (response.statusCode == 200) {
                next(false, body);
            } else {
                next("Abnormal request status code.");
            }
        });
    },
    function(rss) {
        // Parse the RSS data into an array of items then display the title and URL
        // of the first item.
        var handler = new htmlparser.RssHandler();
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(rss);
        if (handler.dom.items.length) {
            var item = handler.dom.items.shift();
            console.log(item.title);
            console.log(item.link);
        } else {
            next("No RSS items found.");
        }
    }
];

function next(err, result) {
    if (err) throw new Error(err);

    var currentTask = tasks.shift();
    if (currentTask) {
        currentTask(result);
    }
}

next();
