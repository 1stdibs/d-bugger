'use strict';

const React = require('react');
const classNames = require('classnames');
const _ = require('lodash');
const DebugRow = require('./DebugRow');

class Dbug extends React.Component {
    constructor() {
        super();
        this.errMsg = 'd-bugger error: `debug` is not an object!';
        this.renderItems = this.renderItems.bind(this);
    }

    renderItems(items, title) {
        var isNonEmptyArray = Array.isArray(items) && items.length;

        if (isNonEmptyArray) {
            return <DebugRow {...this.props} key={title} title={title} items={items}/>;
        }
    }

    render() {
        const classes = classNames({ 'col-md-12': this.props.bootstrap });
        const dbug = this.props.dbug;

        if (_.isObject(dbug)) {
            return (
                <div id='Dbug' className={classes}>
                    <h1 className='d-bugger-title'>Server-side Debug Info</h1>
                    { _.map(dbug, this.renderItems) }
                </div>
            );
        }
        return (
            <div id='Dbug' className={classes}>
                <p>
                    <strong style={{ color: 'red' }}>{this.errMsg}</strong>
                </p>
            </div>
        );
    }
}

module.exports = Dbug;
