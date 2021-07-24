import React from 'react';
import errorIcon from './error.svg';
import './Alert.css'
import {AlertTriangle, ArrowDown} from 'react-feather'

export default class Alert extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (<div style={this.props.style} className={(this.props.variant?"alert " + this.props.variant:'alert')}>
            <div className="alert-icon">
                <AlertTriangle style={{height:'100%', width:'100%', color:'black'}} />
            </div>
            <div className="alert-msg">
                <span>{this.props.children}</span>
            </div>

        </div>
        )
    }
}