import React from 'react';
import './Widget.css';


class Widget extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="widget" >
                <div className="info">
                    <span>{this.props.title}</span>
                    <h2>{this.props.data}</h2>
                </div>
                <div className="icon-container" style={{ height: '100px', width: '100px', margin: 'auto', marginRight: '0', borderRadius: '50%' }}>
                    <img className="widget-icon" src={this.props.icon} />
                </div>
            </div>
        );
    }
}
