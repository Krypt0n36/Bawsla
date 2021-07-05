import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Map } from './../Map/Map';

import mapMarkerIcon from './../icons/map-marker.svg';
import { MNavbar, Navbar } from '../Navbar/Navbar';
import { Card } from '../Card/Card';
import globals from './../var';
import socketIOClient from "socket.io-client";
import cookies from 'react-cookies';


var socket;
class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = { current_party: 8, convo: [], composer: '' }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // connect to chat server
    socket = socketIOClient.io(globals.socketio_url, {
      auth: {
        'identifier': cookies.load('user_id'),
        'session_token': cookies.load('session_token')
      }
    });

  }
  handleChange(event) {
    this.setState({ composer: event.target.value });
  }

  handleSubmit(event) {
    socket.emit('push_message', {
      identifier:cookies.load('user_id'),
      session_token:cookies.load('session_token'),
      dest:this.state.current_party,
      body:this.state.composer
    })
    this.setState({composer:''})
    event.preventDefault();
  }
  componentWillMount() {
    socket.emit('pull_convo', { party_id: this.state.current_party, identifier: cookies.load('user_id') })
    // load convo
    socket.on('accpt_convo', (data) => {
      this.setState({ convo: data });
    });
    socket.on('accpt_message', (data)=>{
      const arr = this.state.convo;
      arr.push(data)
      this.setState({convo:arr})
    })
  }
  componentWillUnmount() {
    socket.off('recv_convo')
  }


  

  render() {
    return (
      <div style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: '#F9FAFC' }}>
        <div>
          <h3>Conversation with {this.state.current_party} : </h3>
          <hr></hr>
          <div style={{ height: '400px', overflowY: 'scroll', overflowX: 'scroll' }}>
            {this.state.convo.map(item => <p><b>{item.sender}</b> : {item.body}</p>)}
          </div>
          <hr></hr>
          <div>
              <label>
                Name:
                <input type="text" value={this.state.composer} onChange={this.handleChange} />
              </label>
              <button onClick={this.handleSubmit} >Submit</button>
          </div>
        </div>
      </div>
    );
  }
}



export default Playground;