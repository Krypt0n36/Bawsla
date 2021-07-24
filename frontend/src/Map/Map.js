import React from 'react';
import { Button } from '../Buttons/Buttons';
import globals from './../var';


class LocationPicker extends React.Component{
    constructor(props){
        super(props);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.state = {pos:{lng:0,lat:0}}
    }
    onMessageReceived(event){
        this.setState({pos:event.data}, ()=>{
            this.props.onMapChange(this.state.pos)
        })
    }
    componentDidMount(){
        window.addEventListener("message", this.onMessageReceived, false);
    }
    componentWillUnmount(){
        window.removeEventListener("message",this.onMessageReceived);
    }
    render(){
        return (
            <div style={this.props.style}>
                <iframe src={`${globals.frontend_url}/location-picker.html`} style={{border:'none', borderRadius:'7px', width:'100%', height:'100%'}}>
                </iframe>
            </div>
        );
    }
}


class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {iframe:null}
        this.iframeLoad = this.iframeLoad.bind(this)
    }
    iframeLoad(e){
        const mapFrame = document.getElementById('map-frame')
        mapFrame.contentWindow.postMessage({lat: 36.8475901,
            lng: 10.2009443}, '*')
        alert('done')
    }
    
    render(){
        return (
            <div style={this.props.style}>
                <iframe id="map-frame" src={`${globals.frontend_url}/location-marker.html`} style={{border:'none', borderRadius:'7px', width:'100%', height:'100%'}}>
                </iframe>
                <Button value="show"  onClick={this.iframeLoad} />
            </div>
        );
    }
}

export {Map,LocationPicker}