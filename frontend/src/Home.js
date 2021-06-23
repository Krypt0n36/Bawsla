import logo from './logo.svg';
import { Button } from './Buttons/Buttons.js';
import { DropDown, Textbox } from './Textbox/Textbox.js';
import Checkbox from './Checkbox/Checkbox.js';
import arrowRightIcon from './icons/arrow-right-circle.svg';
import mapPin from './icons/map-pin.svg';
import React, { Fragment } from 'react';
import SearchPanel from './SearchPanel/SearchPanel.js';
import brandIcon from './icons/brand1.svg';
import { Navbar } from './Navbar/Navbar.js'
import LandingPicture from './LandingPicture/LandingPicture';
import { Card } from './Card/Card.js';
import Footer from './Footer/Footer.js';
import './global.css';
//import Modal from './Modal/Modal';
import { LoginForm } from './Login/Login'
import { RegisterForm } from './Register/Register'
import { Reset, Reset1, Reset2, Reset3 } from './Reset/Reset'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import cookieIcon from './icons/cookie.svg';
import cookies from 'react-cookies';
import globals from './var';
import Loading from './Loading/Loading';

class CookiesAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayed: false }
    this.showAlert = this.showAlert.bind(this)
    this.hideAlert = this.hideAlert.bind(this)

  }
  showAlert() {
    this.setState({ displayed: true })
  }
  hideAlert() {
    this.setState({ displayed: false })
  }
  componentWillMount() {
    if (!cookies.load('idfa')) {
      this.showAlert();
    }
  }
  render() {
    return (
      <div className="cookiePopContainer" style={{ display: this.state.displayed == true ? 'inline-flex' : 'none' }}>
        <div className="cookiePopIconContainer">
          <img src={cookieIcon} style={{ height: '100%' }} />
        </div>
        <div className="cookiePopInfo">
          <h2 style={{ margin: '0px', fontSize: '22px' }}>We use cookies!</h2>
          <span>Bawsla uses browsers cookies to provide you with
better services and user experience.</span>
          <div className="cookiePopInfoButtons">
            <Button variant="transparent" value="Leave" style={{ backgroundColor: 'white', marginRight: '5px' }} onClick={this.hideAlert} />
            <Button variant="primary" value="Okay" onClick={this.hideAlert} />
          </div>
        </div>

      </div>
    );
  }
}

class Bubble extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="bubble-container">
        <div className="bubble" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${globals.frontend_url}/cities/` + this.props.label + '.jpg)' }}>

        </div>
        <div className="bubble-info">
          <h2>{this.props.label}</h2>
          <span>Price starting at 230 DT</span>

        </div>
      </div>
    )
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalContent: <Reset />, modalOpen: false, cards: [] };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(compo) {
    this.setState({ modalContent: compo, modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }
  componentWillMount() {
    
    fetch(`${globals.backend_url}/api/listing/fetch`)
      .then(resp => resp.json())
      .then((result) => {
        this.setState({ cards: result['data'] }, () => {
          console.log(this.state.cards)
        });
      })
      
  }
  render() {
    return (
      <div className="App">
        <CookiesAlert />
        <Navbar openModal={this.openModal} page="Home" />
        <div className="page-padding" style={{ boxSizing: 'border-box', paddingTop: '0px' }}>
          <LandingPicture />
        </div>
        <div className="page-padding" style={{ boxSizing: 'border-box', marginBottom: '30px' }}>
          <h1 style={{ margin: '0px', marginBottom: '5px', fontWeight: '800', fontSize: '25px', color: 'black' }}>Browse by city</h1>
          <span style={{ color: 'rgba(0, 0, 0, 0.776)' }}>Select your city and start exploring.</span>
          <div className="y-slider" style={{ marginTop: '30px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', width: '100%', overflowY:'scroll' }}>
              <div style={{display:'grid', width:'50%'}}>
                <Bubble label="Tunis" />
                <Bubble label="Gabes" />
              </div>
              <div style={{display:'grid', width:'50%'}}>
                <Bubble label="Sousse" />
                <Bubble label="Nabeul" />
              </div>
              <div style={{display:'grid', width:'50%'}}>
                <Bubble label="Kairouan" />
                <Bubble label="Beja" />
              </div>
              <div style={{display:'grid', width:'50%'}}>
                <Bubble label="Mahdia" />
                <Bubble label="Bizerte" />
              </div>

            </div>
            <Link to="/"> Show all</Link>

          </div>
        </div>


        <div className="page-padding" style={{ boxSizing: 'border-box', backgroundColor: '#F7F7F7' }}>

          <h1 style={{ margin: '0px', marginBottom: '5px', fontWeight: '800', fontSize: '25px', color: 'black' }}>Explore listings</h1>
          <span style={{ color: 'rgba(0, 0, 0, 0.776)' }}>Select your city and start exploring.</span>
          <div className="" style={{ display: 'inline-flex', flexWrap: 'wrap', width: '100%', marginTop: '30px' }}>
            {(this.state.cards.length>0)?this.state.cards.map((item, index) => <div className="w-50-mob" style={{ width: '25%', padding: (index % 2 == 0) ? '0px 2.5px 0px 0px' : '0px 0px 0px 2.5px',padding:'5px', boxSizing: 'border-box' }}><Card data={item} /></div>):<Loading />}
          </div>






        </div>





        <Footer />
      </div>
    );
  }


}

