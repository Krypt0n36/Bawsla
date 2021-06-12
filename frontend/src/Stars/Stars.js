import React from 'react';

import yellowStarIcon from './yellow-star.svg';
import grayStarIcon from './gray-star.svg';


export default class Stars extends React.Component{
    constructor(props){
        super(props);
        this.state = {arr:[0,0,0,0,0,0]}
    }

    render(){
        if(this.props.dynamic == true){
            return (
                <div>
                    
                </div>
            );
        }else{
            return (
                <div>
                    {this.state.arr.map((item, index)=><img src={(index>=this.props.value)?grayStarIcon:yellowStarIcon} style={{marginRight:'2px', height:this.props.dim || '15px'}}/> )}
                </div>
            );
        }
        
    }
}