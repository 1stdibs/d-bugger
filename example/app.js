'use strict';

/**
 * babel is required to compile dbugger's UI (.jsx)
 * In a consuming app, one would need to
 * `require babe/register` in a way similar to
 * this babelhook example
 */
require('../babelhook');

var express = require('express');
var dbugger = require('../');
var reports = require('../test/sampleReports').reports;

var app = express();
var port = process.env.NODE_PORT || 1337;

app.set('views', __dirname);
app.set('view engine', 'jade');

/**
 *
 * Attach the debugger with default options
 *
 */
app.use(dbugger.setup());

app.get('/', function (req, res) {
    // file debug reports
    Object.keys(reports).forEach(function (key) {
        res.dbugger(reports[key]);
    });

    // render the view
    res.render('index', { title: 'dbugger example' });
});

app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log('example app listening on on port: ' + port);
});
