import React from 'react';



export default class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        this.setState({ active: !this.state.active });
    }
    render() {
        if (this.state.active == true) {
            return (
                <div style={this.props.style}>
                    <div style={{ display: 'inline-flex' }}>
                    <div onClick={this.handleClick} style={{ height: '20px', width: '35px', backgroundColor: '#45CB4F', borderRadius: '50px', boxSizing: 'border-box', padding: '2px', position: 'relative', marginRight:'5px'}}>
                        <div style={{ borderRadius: '50%', backgroundColor: 'white', width: '16px', height: '16px', margin: 'auto', marginRight: '0px', margin: 'auto', position: 'absolute', right: '2px' }}></div>
                    </div>
                    <label>{this.props.label}</label>
                </div>
                </div>
                

            );
        } else {
            return (
                <div style={this.props.style}>

                <div style={{ display: 'inline-flex' }}>
                    <div onClick={this.handleClick} style={{ height: '20px', width: '35px', backgroundColor: '#EBEBEB', borderRadius: '50px', boxSizing: 'border-box', padding: '2px', position: 'relative', marginRight:'5px' }}>
                        <div style={{ borderRadius: '50%', backgroundColor: 'white', width: '16px', height: '16px', margin: 'auto', position: 'absolute', left: '2px' }}></div>
                    </div>
                    <label>{this.props.label}</label>
                </div>
                </div>
            );
        }

    }
}