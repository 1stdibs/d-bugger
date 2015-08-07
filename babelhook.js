/*!  */
/**
 * Created by timwhidden
 * Date: 8/7/15
 * Time: 6:52:27PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */
'use strict';

// This file is required in mocha.opts
// The only purpose of this file is to ensure
// the babel transpiler is activated prior to any
// test code, and using the same babel options
require('babel/register')({
    ignore: false,
    extensions: ['.jsx', '.js'],
    only: /\.js$|jsx$/
});
