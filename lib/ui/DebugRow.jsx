'use strict';

const React = require('react');
const classNames = require('classnames');
const _ = require('lodash');

const ServiceRequest = require('./ServiceRequest');
const ErrorRow = require('./ErrorRow');
const GenericReportRow = require('./GenericReportRow');

class DebugRow extends React.Component {
    static renderItem(item, index) {
        if (item instanceof Error) {
            return <ErrorRow key={index} index={index} error={item}/>;
        }

        if (item.httpRequest) {
            return <ServiceRequest key={index} item={item}/>;
        }

        return <GenericReportRow key={index} item={item}/>;
    }

    render() {
        const items = this.props.items;
        const wrapperClasses = classNames('d-bugger-wrapper', {'row': this.props.bootstrap });
        const tableClasses = classNames('d-bugger-table', {
            'table table-borderless': this.props.bootstrap
        });
        const requestRow = _.find(items, (item) => item.level === 'success');
        const erroRow = _.find(items, (item) => (item instanceof Error || item.level === 'error'));
        const rowClasses = classNames('d-bugger-row', {
            'd-bugger-error-row': erroRow,
            'd-bugger-success-row': requestRow,
            'd-bugger-generic-row': !erroRow && !requestRow
        });

        if (items) {
            return (
                <div className={wrapperClasses}>
                    <table className={tableClasses}>
                        <thead>
                            <tr className={rowClasses}>
                                <th colSpan="2">{this.props.title}</th>
                            </tr>
                        </thead>
                        { _.map(items, DebugRow.renderItem) }
                    </table>
                </div>
            );
        }
    }
}

module.exports = DebugRow;
