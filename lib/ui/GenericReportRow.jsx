'use strict';

const React = require('react');
const _ = require('lodash');

class GenericReportRow extends React.Component {

    static renderItem(value, key) {
        return (
            <tr key={key} className='d-bugger-row'>
                <td className="d-bugger-generic-key">{key}:</td>
                <td className='d-bugger-generic-value'><strong>{'' + value}</strong></td>
            </tr>
        );
    }

    render() {
        const item = this.props.item;
        const topLevel = Object.keys(item); // title of report

        return (
            <tbody>
            <tr className='d-bugger-row'>
                <td className='d-bugger-title' colSpan='2'>{topLevel}</td>
            </tr>
            { _.map(item[topLevel], GenericReportRow.renderItem) }
            </tbody>
        );
    }
}

module.exports = GenericReportRow;
