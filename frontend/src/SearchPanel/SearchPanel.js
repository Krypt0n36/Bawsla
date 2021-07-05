import React from 'react';
import './searchpanel.css';
import {Button} from './../Buttons/Buttons.js';
import {DropDown, LocationSelector, Textbox} from './../Textbox/Textbox.js';
import mapPin from './../icons/map-pin.svg';
import { MapPin } from 'react-feather';


export default class SearchPanel extends React.Component{
    constructor(props){
      super(props);
      this.state = {mapData:[], regionList:[], city_value:'*', region_value:'*', type_value:'*'}
      this.handleSelect = this.handleSelect.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(){
      window.location = `explorer/${this.state.city_value}/${this.state.region_value}/${this.state.type_value}`
    }
    componentWillMount(){
      fetch('/map.json')
          .then(resp=>resp.json())
          .then((data)=>{
              let arr = [{name:'All', regions:[]}]
              for(var key in data){
                  arr[key] = data[key];
              }
              this.setState({mapData:arr}, ()=>{
                  console.log(this.state.mapData)
              });
              
          })
  }
    handleSelect(key2){
      var arr = [{name:'All'}]
      for(var key in this.state.mapData[key2].regions){
        arr[key] = this.state.mapData[key2].regions[key];
      } 
      this.setState({regionList:arr, city_value:this.state.mapData[key2].name});
    }
    handleSelectRegion(key){
      this.setState({region_value:this.state.regionList[key].name});
    }
    handleChange(event){
      try{
          event.preventDefault();
      }catch{
          
      }
      console.log(event.target.name+' = '+event.target.value);
      
      this.setState({[event.target.name]:event.target.value});
  }
    render(){
      return (
        <div style={this.props.style} className="searchPanelBack" >
          <div className="searchPanel">
            <div className="searchPanel-col" >
              <LocationSelector value="City" style={{width:'100%'}} icon={<MapPin style={{width:'100%', height:'100%', color:'#bfbfbf'}}/>} data={this.state.mapData} onSelect={(key)=>{this.handleSelect(key)}}/>
            </div>
            <div className="searchPanel-col">
              <LocationSelector value="Region" style={{width:'100%'}} data={this.state.regionList} onSelect={(key)=>{this.handleSelectRegion(key)}}/>
            </div>
            <div className="searchPanel-col">
              <DropDown style={{width:'100%'}} value="Select Type" data={["All","Appartment","Duplex","Villa","Shared room", "Individual room" ]} name="type_value" onChange={this.handleChange} />
            </div>
            <div className="searchPanel-col">
                <Button variant="primary" style={{width:'100%'}} value="Explore" onClick={this.handleSubmit} />  
            </div>
          </div>
        </div>
      );
    }
  }