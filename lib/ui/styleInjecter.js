'use strict';
(function (doc) {
    var css = '%css%';
    var head = doc.head || doc.getElementsByTagName('head')[0];
    var style = doc.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(doc.createTextNode(css));
    }
    head.appendChild(style);
})(document);
