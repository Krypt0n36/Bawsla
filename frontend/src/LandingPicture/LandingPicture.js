import React from 'react';
import {Button,TabButton} from './../Buttons/Buttons.js';

import './landingpicture.css';
import {SearchPanelText, SearchPanelSelect, SearchPanelMap} from './../SearchPanel/SearchPanel.js';
import Background from './../pictures/background0.jpg';

export default class LandingPicture extends React.Component{
    constructor(props){
        super(props)
        this.state = {activeSearchForm:2}
        this.selectType = this.selectType.bind(this)

    }
    selectType(typeId){
        if(typeId){
            this.setState({activeSearchForm:typeId})
        }
    }
    render(){
        return (    
            <div className="landing-picture-container">
                <div className="landing-picture-overlay"> 
                <div className="wraper">
                    <h1 className="landing-title">Bringing housing closer!</h1>
                    <span className="subtitle">House rental & Real estate made simple.</span>
                    <div style={{width:'70%', margin:'auto'}}>
                    {this.state.activeSearchForm==1&&<SearchPanelText style={{margin: 'auto', marginTop:'50px'}}/> }
                    {this.state.activeSearchForm==2&&<SearchPanelSelect style={{margin: 'auto', marginTop:'50px'}}/> }
                    {this.state.activeSearchForm==3&&<SearchPanelMap style={{margin: 'auto', marginTop:'50px'}}/> }
                    </div>
                    <div style={{margin:'auto', display:'inline-flex', marginTop:'10px'}}>
                    <TabButton onClick={()=>this.selectType(1)} active={this.state.activeSearchForm==0} style={{marginLeft:'2.5px',marginRight:'2.5px'}} value="Text search" variant={this.state.activeSearchForm==1?"dark active":'dark' }/>
                    <TabButton onClick={()=>this.selectType(2)} active={this.state.activeSearchForm==1} style={{marginLeft:'2.5px',marginRight:'2.5px'}} value="Location search" variant={this.state.activeSearchForm==2?"dark active":'dark' } />
                    <TabButton onClick={()=>this.selectType(3)} active={this.state.activeSearchForm==2}  style={{marginLeft:'2.5px',marginRight:'2.5px'}} value="Map search" variant={this.state.activeSearchForm==3?"dark active":'dark' } />
                    </div>
                    
                
                    </div>
                </div>
            </div>
        );
    }
}