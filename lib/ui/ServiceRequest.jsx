'use strict';

var React = require('react');

class ServiceRequest extends React.Component {
    render() {
        const { url, method, level, status, response } = this.props.item;
        return (
            <tr className={ 'd-bugger-' + level + '-row' }>
                <td>
                    <div>
                        <span style={ { display: 'block' } }>{ method } | { status }</span>
                        <a className={ 'd-bugger-' + level + '-url' } target='_blank' href={ url }>{ url }</a>
                    </div>
                    <pre className={ level }>{ JSON.stringify(response, null, 4) }</pre>
                </td>
            </tr>
        );
    }
}

module.exports = ServiceRequest;
