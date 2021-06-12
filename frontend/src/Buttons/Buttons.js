import React from 'react';
import './buttons.css';

class ButtonOld extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<button disabled={this.props.disabled} onClick={this.props.onClick} style={this.props.style} className={"btn " + this.props.variant}>{this.props.buttonLeftIcon && <img className="button-left-icon" style={{ marginRight: '5px' }} src={this.props.buttonLeftIcon} />} {this.props.value ? this.props.value : <img className="button-center-icon" src={this.props.buttonCenterIcon} />} {this.props.buttonRightIcon && <img className="button-right-icon" src={this.props.buttonRightIcon} />} {this.props.children}</button>

		);
	}
}

class TabButton extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className={this.props.active?'tab-button active ':'tab-button'}>
				{this.props.value}
			</div>
		);
	}
}


class Button extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.buttonCenterIcon) {
			return (
				<div className={"btn " + this.props.variant} style={this.props.style} onClick={this.props.onClick}>
					<div style={{ height: '100%', width: '50px', boxSizing: 'border-box', padding: this.props.innerPadding?this.props.innerPadding:'13px' }}>
						{this.props.buttonCenterIcon}
					</div>
				</div>
			);
		}
		else if (this.props.buttonLeftIcon) {
			return (
				<div className={"btn " + this.props.variant} style={this.props.style} onClick={this.props.onClick}>
					<div style={{ height: '100%', width: '50px', boxSizing: 'border-box', padding:this.props.innerPadding?this.props.innerPadding:'17px' }}>
						{this.props.buttonLeftIcon}
					</div>
					<div style={{
						textAlign: 'left', textAlign: 'left',
						height: 'fit-content',
						width: 'fit-content',
						whiteSpace: 'nowrap',
						fontSize: '12px',
						lineHeight: '4.4',
						paddingRight: '14px',
					}}>
						{this.props.value}
					</div>
				</div>
			);
		}
		else if (this.props.buttonRightIcon) {
			return (
				<div className={"btn " + this.props.variant} style={this.props.style} onClick={this.props.onClick}>
					<div style={{
						textAlign: 'left', textAlign: 'left',
						height: 'fit-content',
						width: 'fit-content',
						whiteSpace: 'nowrap',
						fontSize: '12px',
						lineHeight: '4.4',
						paddingLeft: '14px',
					}}>
						{this.props.value}
					</div>
					<div style={{ height: '100%', width: '50px', boxSizing: 'border-box', padding:this.props.innerPadding?this.props.innerPadding:'17px'}}>
						{this.props.buttonRightIcon}
					</div>
				</div>
			);
		}else{
			return (
			<div className={"btn " + this.props.variant} style={this.props.style} onClick={this.props.onClick}>
					
					<div style={{
						textAlign: 'left', textAlign: 'left',
						height: 'fit-content',
						width: '100%',
						whiteSpace: 'nowrap',
						fontSize: '12px',
						lineHeight: '4.4',
						paddingRight: '30px',
						paddingLeft: '30px',
						textAlign:'center',
					}}>
						{this.props.value}
					</div>
			</div>
			);
		}

	}
}
export { Button, TabButton };