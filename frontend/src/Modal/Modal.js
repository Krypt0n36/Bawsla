import React from 'react';
import './Modal.css'
import './../Well/Well';

export default class Modal extends React.Component{
    constructor(props){
        super(props);
        this.state = {hidden:false};
        this.toggle = this.toggle.bind(this);
    }
    toggle(){
        this.setState({hidden:!this.state.hidden});
    }
    render(){
        return(
            <div>
            {(this.state.hidden==false)&&<div className="modal-overlay" onClick={this.toggle}>
                <div className="modal-body">
                    {this.props.contentComp}
                </div>
            </div>
            }
            </div>
        );
    }
}