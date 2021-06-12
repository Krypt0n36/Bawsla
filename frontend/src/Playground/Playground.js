import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Map} from './../Map/Map';

import mapMarkerIcon from './../icons/map-marker.svg';
import { MNavbar, Navbar } from '../Navbar/Navbar';
import { Card } from '../Card/Card';

 
class Playground extends Component {
  constructor(props){
   super(props);
  }
 
  
  render() {
    return (
      <div style={{position:'absolute',height:'100%', width:'100%', backgroundColor:'#F9FAFC'}}>
        <Navbar />
      </div>
    );
  }
}
 
export default Playground;