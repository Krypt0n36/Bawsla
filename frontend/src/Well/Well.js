import React from 'react';





export default class Well extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="well" style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}