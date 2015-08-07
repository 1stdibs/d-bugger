/*!  */
/**
 * Created by timwhidden
 * Date: 8/7/15
 * Time: 6:49:13PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */

'use strict';

const dbugger = require('../');
const assert = require('assert').ok;
const cheerio = require('cheerio');
const reports = require('./sampleReports').reports;
const errMsg = require('./sampleReports').errMsg;

const noop = () => {};

describe('Dee. Bug. Eer.', function () {
    let res;
    let middleware;

    beforeEach(() => {
        res = { locals: {} };
        middleware = dbugger.setup();
        middleware({}, res, noop);
    });

    it('is a function', () => assert(typeof dbugger === 'function'));

    describe('middleware', () => {
        it('has an arity of 3', () => {
            assert(middleware.length === 3);
        });

        it('can set and dump props', () => {
            res.dbugger({ test: 'value' });

            let dump = res.dbugger.dump();
            assert(Array.isArray(dump['debugger output']));
            assert(dump['debugger output'][0].test === 'value');
        });
    });

    describe('httpReqReport', () => {
        it('returns a httpReqReport object with defaults mixed with options', () => {
            let r = reports.requestSuccess;

            assert(r.hasOwnProperty('set') === false);
            assert(r.httpRequest);
            assert(r.level = 'success');
            assert(r.url === 'http://good.com');
            assert(r.status === 200);
            assert(r.method === 'GET');

            r = reports.requestError;
            assert(r.level === 'error');
            assert(r.status === 500);
            assert(r.url === 'http://bad.com');
        });
    });

    describe('HTML', () => {
        it('outputs for successful http requests', () => {
            res.dbugger(reports.requestSuccess);
            let out = res.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('#Dbug').length === 1);
            assert($('.d-bugger-wrapper').length === 1);
            assert($('.d-bugger-success-row').length === 2);
        });

        it('outputs for unsuccessful http requests', () => {
            res.dbugger(reports.requestError);
            let out = res.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('#Dbug').length === 1);
            assert($('.d-bugger-wrapper').length === 1);
            assert($('.d-bugger-error-row').length === 2);
        });

        it('outputs for errors', () => {
            res.dbugger(reports.jsError);
            let out = res.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('#Dbug').length === 1);
            assert($('.d-bugger-wrapper').length === 1);
            assert($('label.d-bugger-error-message').text() === errMsg);
        });

        it('outputs for all sorts of stuff', () => {
            // add all debug reports
            Object.keys(reports).forEach((key) => {
                res.dbugger(reports[key])
            });

            let out = res.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('.d-bugger-wrapper').length = 5);
        });

        it('outputs default styles by default', () => {
            res.dbugger(reports.requestSuccess);
            let out = res.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('script').length === 1);
        });
    });

    describe('options', () => {

        it('turns off default styles', () => {
            let localRes = { locals: {} };

            dbugger.setup({ useDefaultCss: false })({}, localRes, noop); // create middleware function and immediately invoke it
            localRes.dbugger(reports.requestSuccess);

            let out = localRes.locals.dbug.print();
            let $ = cheerio.load(out);
            assert($('script').length === 0);
        });


        it('outputs bootstrap classes', () => {
            let localRes = { locals: {} };

            dbugger.setup({ bootstrap: true })({}, localRes, noop); // create middleware function and immediately invoke it

            // add all debug reports
            Object.keys(reports).forEach((key) => {
                localRes.dbugger(reports[key])
            });

            let out = localRes.locals.dbug.print();
            let $ = cheerio.load(out);

            assert($('.col-md-12').length === 1);
            assert($('.table.table-borderless').length === 3);
        });

        it('can modify locals var name', () => {
            let localRes = { locals: {} };

            dbugger.setup({ localsVar: 'foo' })({}, localRes, noop); // create middleware function and immediately invoke it
            assert(localRes.locals.foo.print);
        });

        it('can modify response method name', () => {
            let localRes = { locals: {} };

            dbugger.setup({ resMethod: 'foo' })({}, localRes, noop); // create middleware function and immediately invoke it
            assert(typeof localRes.foo === 'function');
            assert(typeof localRes.foo.dump === 'function');
        });
    });
});
