import React from 'react';
import './local.css';


export default class StepIndic extends React.Component{
    constructor(props){
        super(props);

    }
    render(){
        return (
            <div style={{display:'block'}} >
            <div className="container" >
                <div style={{width:'100%'}} >
                    <div className="step">
                        <div className={'ball ' + ((this.props.step>=1)&&' reached')}></div>
                        <div className={'line ' + ((this.props.step>=2)&&' reached')}></div>
                    </div>
                </div>
                <div style={{width:'100%'}} >
                    <div className="step">
                        <div className={'ball ' + ((this.props.step>=2)&&' reached')}></div>
                        <div className={'line ' + ((this.props.step>=3)&&' reached')}></div>
                    </div>
                </div>
                <div style={{width:'auto'}}>
                    <div className="step final">
                        <div className={'ball ' + ((this.props.step>=3)&&' reached')}></div>
                    </div>
                </div>
            </div>
            <div style={{display:'inline-flex', width:'100%'}}>
                <div style={{width:'33.33%',color:((this.props.step==1)&&' #EF3D49')}}>
                    General Details
                </div>
                <div style={{width:'33.33%', textAlign:'center',color:((this.props.step==2)&&' #EF3D49')}}>
                    Geografic Details
                </div>
                <div style={{width:'33.33%',textAlign:'right',color:((this.props.step==3)&&' #EF3D49')}}>
                    Media
                </div>
            </div>
            </div>
        );
    }
}