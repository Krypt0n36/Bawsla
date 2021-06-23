import React from 'react';
import {Button} from './../Buttons/Buttons.js';

import './landingpicture.css';
import SearchPanel from './../SearchPanel/SearchPanel.js';
import Background from './../pictures/background0.jpg';

export default class LandingPicture extends React.Component{
    render(){
        return (
            <div className="landing-picture-container">
                <div className="landing-picture-overlay"> 
                <div className="wraper">
                    <h1 className="landing-title">Bringing housing closer!</h1>
                    <span className="subtitle">House rental & Real estate made simple.</span>
                    <SearchPanel style={{margin: 'auto', marginTop:'50px', background:'none'}}/> 
                </div>
                </div>
            </div>
        );
    }
}