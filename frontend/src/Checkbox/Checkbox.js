import React from 'react';
import './checkbox.css';
import CheckIcon from './../icons/check-white.svg';



export default class Checkbox extends React.Component{
    constructor(props){
        super(props);
        this.state = {checked:(this.props.checked==true)}
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        this.setState({checked:!this.state.checked})
    }
    render(){
        return (
            <div className="checkbox-container" onClick={this.handleClick}>
                <div className={((this.state.checked==true)?"checkbox checkbox-checked":"checkbox")}>
                    {(this.state.checked==true)&&<img src={CheckIcon} style={{width:'19px'}} />}
                </div>
                <div className="checkbox-label">{this.props.label}</div>
            </div>
        )
    }
}