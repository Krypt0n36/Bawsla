import React from 'react';
import './Loading.css'
import Spinner from './../spinner.svg';


 
export default class Loading extends React.Component{
    constructor(props){
        super(props);
    } 
    render(){
        return (
            <div className="loader-container">
                <div style={{margin:'auto', width:'fit-content'}}>
                    <img src={Spinner} className="loader-spinner" />

                </div>
            </div>
        );
    }
}