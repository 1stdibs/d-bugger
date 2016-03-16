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

function loadCss() {
    return fs
        .readFileSync(__dirname + '/ui/default.css', { encoding: 'utf8' })
        .replace(/(?:\r\n|\r|\n)/g, ' ');
}

function loadScriptInjector() {
    return fs.readFileSync(__dirname + '/ui/styleInjecter.js', { encoding: 'utf8' });
}

/**
 *
 * @param {object} res Express's Response object
 * @param {object} options
 * @description This method is invoked in `setup` to enable
 * debugging for the current request
 * @returns {resMethod}
 */
var dbugger = function (res, options) {
    var error = 'error requests and errors';
    var success = 'successful requests';
    var generic = 'debugger output';
    // alias res.local[options.localsVar] to a local for convenience
    var dbug = res.locals[options.localsVar] = {};

    // set them main `report` types
    dbug[error] = [];
    dbug[success] = [];
    dbug[generic] = [];
    // don't want to iterate over this method when
    // outputting the dbug reports
    Object.defineProperty(dbug, 'print', { value: print });

    /**
     * @description Output HTML string of debugger output
     * This is invoked in the template like: `dbug.print()`
     * @returns {string}
     */
    function print (printOptions) {
        var css = printOptions && printOptions.development ? loadCss() : cachedCss;
        var script = '<script>'+ inject.replace('%css%', css) + '</script>';
        var el = React.createElement(Dbug, {
            dbug: assign({}, dbug),
            bootstrap: options.bootstrap
        });
        return React.renderToString(el) + ( options.useDefaultCss ? '\n' + script : '');
    }

    /**
     * @param {Object} report A hash a values making up a debug report
     */
    function resMethod (report) {
        if (report.httpRequest) {
            if (report.level === 'error') {
                dbug[error].push(report);
            } else {
                dbug[success].push(report);
            }
        } else if (report instanceof Error) {
            dbug[error].push(report);
        } else {
            dbug[generic].push(report);
        }
    }

    /**
     * @description Returns a copy of the the current dbug report
     * @returns {object}
     */
    resMethod.dump = function () {
        return assign({}, dbug);
    };

    return resMethod;
};

/**
 * @param {object} [opts] Options set bootstrap option to true to
 * render bootstrap CSS classes; set useCss option to false to not use default CSS
 * @returns {Function} The dbugger middleware
 */
dbugger.setup = function (opts) {
    var defaults = {
        bootstrap: false,
        useDefaultCss: true,
        localsVar: 'dbug',
        resMethod: 'dbugger'
    };

    opts = assign(defaults, opts);

    return function (req, res, next) {
        res[opts.resMethod] = dbugger(res, opts);
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

module.exports = dbugger;
