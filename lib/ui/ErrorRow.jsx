'use strict';

const React = require('react');
const classNames = require('classnames');

class ErrorRow extends React.Component {
    render() {
        const { index, error } = this.props;
        return (
            <tr className='d-bugger-error-row'>
                <td>
                    <label className='d-bugger-error-message' htmlFor={'errstack' + index}>
                        { error.message }
                    </label>
                    <textarea
                        disabled
                        className="d-bugger-error-stack"
                        id={'errstack' + index}
                        value={error.stack}>
                    </textarea>
                </td>
            </tr>
        );
    }
}

module.exports = ErrorRow;
