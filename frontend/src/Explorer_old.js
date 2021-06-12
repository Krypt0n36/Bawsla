import React from 'react';
import {Navbar} from './Navbar/Navbar';
import {Card} from './Card/Card';
import {Button} from './Buttons/Buttons';
import LandingPicure from './LandingPicture/LandingPicture'
import {Textbox, DropDown} from './Textbox/Textbox';
import './global.css';
//import Well from './Well/Well';
import gridIcon from './icons/grid.svg';
import listingIcon from './icons/listing.svg';
import SearchPanel from './SearchPanel/SearchPanel';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Footer from './Footer/Footer';

export default class Explore extends React.Component{
    constructor(props){
        super(props);
        this.state = { cards:[]};
        
    }
    componentWillMount(){
        fetch(`http://localhost:5000/api/listing/fetch`)
          .then(resp=>resp.json())
          .then((result)=>{
            this.setState({cards:result['data']}, ()=>{
              console.log(this.state.cards)
            });
          })
      }
    render(){
        return (
            <div>
                <Navbar showSearch={false} page="Explorer" />
                
                <div style={{boxSizing:'border-box', paddingLeft:'30px',paddingRight:'30px'}}>
                <div className="search-panel" >
                    <span style={{color:'#fff'}}>Home / Apartment / City name</span>
                    <h2 style={{marginTop: '5px',marginBottom: '5px', color:'#fff'}}>Explore our listings</h2>
                    <span style={{color:'#898F9A'}}>230 Results found</span>
                    <SearchPanel style={{marginTop:'20px'}} />
                </div>

                <div style={{display:'inline-flex', flexWrap:'wrap', marginTop:'20px', marginBottom:'30px', width:'100%'}}>
                    {this.state.cards.map(item=><div style={{width:'25%', padding:'5px', boxSizing:'border-box'}}><Card data={item} /></div>)}          
                 </div>
            </div>
            <Footer />
            </div>
        );
    }
}