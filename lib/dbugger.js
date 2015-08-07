/*!  */
/**
 * Created by timwhidden
 * Date: 7/22/15
 * Time: 2:34:27PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */
'use strict';

var fs = require('fs');
var React = require('react');
var assign = require('lodash/object/assign');
var Dbug = require('./ui/Dbug');

var cachedCss = loadCss();
var inject = loadScriptInjector();
var _locals = {};
var curOpts = {};
var defaults = {
    bootstrap: false,
    useDefaultCss: true,
    localsVar: 'dbug',
    resMethod: 'dbugger'
};

function loadCss() {
    var css = fs.readFileSync(__dirname + '/ui/default.css', { encoding: 'utf8' });

    return css.replace(/(?:\r\n|\r|\n)/g, ' ');
}

function loadScriptInjector() {
    return fs.readFileSync(__dirname + '/ui/styleInjecter.js', { encoding: 'utf8' });
}

/**
 * @description Output HTML string of debugger output
 * @returns {string}
 */
function print (options) {
    var css = options && options.development ? loadCss() : cachedCss;
    var script = '<script>'+ inject.replace('%css%', css) + '</script>';
    var el = React.createElement(Dbug, {
        debug: assign({}, _locals[curOpts.localsVar]),
        bootstrap: curOpts.bootstrap
    });
    return React.renderToString(el) + ( curOpts.useDefaultCss ? '\n' + script : '');
}

/**
 * retrieve a copy of current debug vars
 * @returns {object} the debug object
 */
function dump () {
    return assign({}, _locals[curOpts.localsVar]);
}


/**
 *
 * @param {object} res Express's Response object
 * @returns {Function}
 */
var dbugger = function (res) {
    var error = 'error requests and errors';
    var success = 'successful requests';
    var generic = 'debugger output';
    var debug;

    _locals = res.locals;
    debug = _locals[curOpts.localsVar] = {}; // initialize dbugger locals

    debug[error] = [];
    debug[success] = [];
    debug[generic] = [];
    // and set non-enumerable, non-writable,
    // non-configurable print method
    Object.defineProperty(debug, 'print', { value: print });

    /**
     * @param {Object} report A hash a values making up a debug report
     */
    function dbugger (report) {
        if (report.httpRequest) {
            if (report.level === 'error') {
                debug[error].push(report);
            } else {
                debug[success].push(report);
            }
        } else if (report instanceof Error) {
            debug[error].push(report);
        } else {
            debug[generic].push(report);
        }
    }

    dbugger.dump = dump;
    return dbugger;
};

/**
 * @param {object} [opts] Options set bootstrap option to true to
 * render bootstrap CSS classes; set useCss option to false to not use default CSS
 * @returns {Function} The dbugger middleware
 */
dbugger.setup = function (opts) {
    assign(curOpts, defaults, opts);

    return function (req, res, next) {
        res[curOpts.resMethod] = res[curOpts.resMethod] || dbugger(res);
        next();
    };
};

/**
 * @memberOf dbugger
 * @param {Object} opts
 * @returns {Object} A report object with a `set` method and other defaults
 */
dbugger.httpRequestReport = function (opts) {
    var httpReqObj = Object.create({
        set: function (opts) {
            assign(this, opts);
        }
    });

    return assign(httpReqObj, {
            httpRequest: true,
            level:       'success',
            status:      200,
            stack:       null,
            url:         'no URL',
            method:      'GET',
            response:    'no response body'
        }, opts
    );
};


// expose methods on dbugger
dbugger.print = print;
dbugger.dump = dump;
module.exports = dbugger;
