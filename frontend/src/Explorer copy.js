import React from 'react';
import {Navbar} from './Navbar/Navbar';
import {Card} from './Card/Card';
import {Button} from './Buttons/Buttons';

import {Textbox, DropDown} from './Textbox/Textbox';
import './global.css';
//import Well from './Well/Well';
import gridIcon from './icons/grid.svg';
import listingIcon from './icons/listing.svg';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

export default class Explore extends React.Component{
    render(){
        return (
            <div style={{backgroundColor:'#F7F7F7'}}>
                <Navbar showSearch={true} />
                <br></br>
                <br></br>

                <div style={{display:'inline-flex', flexWrap:'wrap'}}>
                    
                    <div style={{width:'20%', boxSizing:'border-box', padding:'5px'}}>
                        <div className="well" >
                            <h3 style={{textAlign:'center'}}>Search filter</h3>
                            <Textbox style={{width:'100%', marginBottom:'5px'}} placeholder="Title.." />
                            <DropDown style={{width:'100%', marginBottom:'5px'}} value="Select Type" data={["Item number 1","Item number 2","Item number 3","Item number 4"]}/>
                            <DropDown style={{width:'100%', marginBottom:'5px'}} value="Select Type" data={["Item number 1","Item number 2","Item number 3","Item number 4"]}/>
                            <DropDown style={{width:'100%', marginBottom:'5px'}} value="Select Type" data={["Item number 1","Item number 2","Item number 3","Item number 4"]}/>
                            <DropDown style={{width:'100%', marginBottom:'5px'}} value="Select Type" data={["Item number 1","Item number 2","Item number 3","Item number 4"]}/>

                        </div>
                    </div>
                    <div style={{width:'80%', display:'inline-flex', flexWrap:'wrap'}}>
                    <div style={{width:'100%', padding:'5px'}}>
                        <div className="well" style={{display:'inline-flex', width:'100%', height:'60px'}}>
                            <span style={{margin: 'auto',marginLeft: '0'}}>132 Results found.</span>
                            <div style={{margin: 'auto',marginRight: '0', display:'inline-flex'}}>
                                <span style={{lineHeight: '2.3',marginRight: '20px'}}><b>Sort by :</b> Newest.</span>
                                <Button variant="square" style={{width:'40px', height:'40px', marginRight:'5px'}} buttonCenterIcon={gridIcon}/>
                                <Button variant="square" style={{width:'40px', height:'40px'}} buttonCenterIcon={listingIcon}/>

                            </div>
                        </div>
                    </div>
                    <div style={{width:'32%', padding:'5px'}}>
                        <Card />
                    </div>
                    <div style={{width:'32%', padding:'5px'}}>
                        <Card />
                    </div>
                    <div style={{width:'32%', padding:'5px'}}>
                        <Card />
                    </div>
                    <div style={{width:'32%', padding:'5px'}}>
                        <Card />
                    </div>

                    </div>
                </div>
            </div>
        );
    }
}