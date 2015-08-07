/*!  */
/**
 * Created by timwhidden
 * Date: 9/2/15
 * Time: 1:01:22PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */

'use strict';

const dbugger = require('../lib/dbugger');

exports.errMsg = 'Test Error';

/**
 *
 * Example reports that can be filed with debugger
 *   [1] a successful HTTP request report
 *   [2] an unsuccessful HTTP request report
 *   [3] a vanilla JS error
 *   [4], [5] sample generic reports
 */

exports.reports = {
  requestSuccess: dbugger.httpRequestReport({
      url: 'http://good.com',
      response: { message: 'successful response' }
  }),
    requestError:     dbugger.httpRequestReport({
        level:  'error',
        url:    'http://bad.com',
        status: 500,
        response: { message: 'error response' }
    }),
    jsError: new Error(exports.errMsg),
    test1: { 'test title 1': { foo: 'bar', baz: 'qux' }},
    test2: { 'test title 2': { baz: 'qux', foo: 'bar' }}
};
