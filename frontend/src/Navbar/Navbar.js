import React from 'react';
import { Button } from './../Buttons/Buttons.js';
import brandIcon from './../icons/brand1.png';
import sharpBrandIcon from './../sharp-logo.svg';

import './navbar.css';
import { Textbox } from './../Textbox/Textbox';
import IconSearchBox from './../icons/searchWhite.svg';


import InboxIcon from './inbox-dashboard.svg';
import InboxActiveIcon from './inbox-dashboard-active.svg';

import StarIcon from './star-dashboard.svg';
import StarActiveIcon from './star-dashboard-active.svg';

import AgendaIcon from './agenda-dashboard.svg';
import AgendaActiveIcon from './agenda-dashboard-active.svg';

import DashboardIcon from './dashboard-dashboard.svg';
import DashboardActiveIcon from './dashboard-dashboard-active.svg';

import ChatIcon from './../icons/chat-navbar.svg';
import BellIcon from './../icons/bell-navbar.svg';
import LogoutIcon from './logout.svg';
import WishlistIcon from './wishlist.svg';
import SettingsIcon from './settings.svg';
import Dashboard2Icon from './dashboard.svg';

import toggleDownIcon from './../icons/toggle-down.svg';
import cookies from 'react-cookies';

import { Grid, DollarSign, Inbox, Calendar, ChevronDown, MessageCircle, Bell, BellOff, Search, Settings, Heart, LogOut, Menu, X, User } from 'react-feather';
import InboxP from './../Inbox/Inbox'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { LoginForm } from './../Login/Login';
import { RegisterForm, RegisterMain } from '../Register/Register.js';
import userIcon from './user-link.svg';
import { Avatar } from './../Avatar/Avatar';
import Notifications from '../Notifications/Notifications.js';
import Wishlist from '../Wishlist/Wishlist.js';
import { Modal } from 'react-responsive-modal';
import Reset from '../Reset/Reset.js';
import globals from './../var';

class AvatarDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, value: this.props.value, modalContent: <Wishlist />, modalOpen: false };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.onClickDashboard = this.onClickDashboard.bind(this)
  }
  openModal(compo) {
    this.setState({ modalContent: compo, modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }
  onClickDashboard(e) {
    e.preventDefault();
    window.location = '/dashboard'
  }
  handleClick() {
    this.setState({ visible: !this.state.visible })


  }
  handleSelect(callback) {
    this.handleClick();
    callback()
  }
  async handleLogOut(e) {
    e.preventDefault();


    await cookies.remove('session_token');
    await cookies.remove('user_id');
    
    
    window.location = window.location;
  }
  onClickAccountSettings(e,) {
    e.preventDefault();
    window.location = '/settings';
  }
  render() {
    return (
      <div className="dropdown-container" ref={this.container} style={this.props.style}>

        <div style={{ display: 'inline-flex' }} onClick={this.handleClick}>

          <Avatar dim='50px' filename={cookies.load('user_id') + '.jpg'} />
          <div className="mobile-hidden">
            <div style={{ display: 'inline-flex' }}>
            <div style={{ lineHeight: '3', marginLeft: '10px' }}>
              {this.props.account_name}
            </div>
            <Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px', width: '30px', padding: '0px', margin: 'auto', marginLeft: '5px' }} innerPadding="5px" buttonCenterIcon={<ChevronDown style={{ width: '100%', height: '100%' }} />}></Button>

            </div>
           
          </div>
        </div>

        <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
          <div className="dropdown-item" onClick={this.onClickDashboard}><div style={{ width: '15px', height: '15px', marginRight: '10px' }}><Grid style={{ width: '100%', height: '100%' }} /></div><span>Dashboard</span></div>
          <div className="dropdown-item" onClick={this.onClickAccountSettings} ><div style={{ width: '15px', height: '15px', marginRight: '10px' }}><Settings style={{ width: '100%', height: '100%' }} /></div><span>Account Settings</span></div>
          <div className="dropdown-item" onClick={() => this.openModal(<Wishlist />)} ><div style={{ width: '15px', height: '15px', marginRight: '10px' }}><Heart style={{ width: '100%', height: '100%' }} /></div><span>Wishlist</span></div>
          <div className="dropdown-item" onClick={this.handleLogOut} ><div style={{ width: '15px', height: '15px', marginRight: '10px' }}><LogOut style={{ width: '100%', height: '100%' }} /></div><span>Log out</span></div>

        </div>
        <Modal open={this.state.modalOpen} onClose={this.closeModal} center >
          <div style={{ boxSizing: 'border-box' }}>
            {this.state.modalContent}
          </div>
        </Modal>
      </div>
    );
  }
}


class Egg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false }
    this.handleToggle = this.handleToggle.bind(this)
  }
  handleToggle() {
    this.setState({ active: !this.state.active })
  }
  render() {
    return (
      <div style={{ position: 'relative' }} onClick={this.handleToggle}>
        <Button onClick={this.handleToggle} innerPadding="15px" variant={"curvy " + (this.state.active == true && " active")} style={{ width: '50px', height: '50px', boxSizing: 'border-box', position: 'relative', border: 'none', marginRight: '10px' }} buttonCenterIcon={this.props.icon}>
          <div className="button-red-dot"></div>
        </Button>
        <div hidden={!this.state.active} style={{ backgroundColor: 'white', width: '300px', marginTop: '5px', height: '400px', position: 'absolute', left: 'calc(-100% - 50px)', boxShadow: '0px 0px 5px #0000002b', zIndex: '1', borderRadius: '7px' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sandwichToggled: false, user_id: null, modalContent: <Wishlist />, modalOpen: false, modalContent: <Reset />, modalOpen: false, }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleToggleSandwich = this.handleToggleSandwich.bind(this);
  }
  handleToggleSandwich() {
    this.setState({ sandwichToggled: !this.state.sandwichToggled });
  }
  openModal(compo) {
    this.setState({ modalContent: compo, modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }
  componentDidMount() {
    if (cookies.load('session_token')) {
      fetch(`${globals.backend_url}/api/checkAlive?user_id=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
        .then(res => res.json())
        .then((res) => {
          if (res['status'] == 'ok') {
            this.setState({ user_id: cookies.load('user_id'), account_name: res['data']['account_name'], account_type: res['data']['account_type'] })
          } else {
            cookies.remove('session_token');
            cookies.remove('user_id');
            this.setState({ user_id: null, session_token: null, account_name: null, account_type: null })

          }
        })
      this.setState({ user_id: cookies.load('user_id') })

    }
  }
  navigate(link) {
    window.location = link;
  }

  render() {
    if (this.props.type == "dashboard") {
      return (
        <div className="navbar" style={this.props.style}>
          <div className="navbar-brand">
            <Link to="/"><img src={brandIcon} height="32px" /></Link>
          </div>
          <div className="navbar-nav">

            <div className={this.props.page == 'dashboard' ? "navbar-nav-link active" : "navbar-nav-link"} style={{ paddingLeft: '40px', display: 'inline-flex' }} onClick={() => { this.navigate('/dashboard') }}><div><Grid className="nvb-link-icon" /></div> <span className="nvb-link-text" >Dashboard</span></div>
            <div className={this.props.page == 'wallet' ? "navbar-nav-link active" : "navbar-nav-link"} style={{ paddingLeft: '40px', display: 'inline-flex' }} onClick={() => { this.navigate('/dashboard/wallet') }}><div><DollarSign className="nvb-link-icon" /></div> <span className="nvb-link-text" >Wallet</span></div>
            <div className={this.props.page == 'inbox' ? "navbar-nav-link active" : "navbar-nav-link"} style={{ paddingLeft: '40px', display: 'inline-flex' }} onClick={() => { this.navigate('/dashboard/inbox') }}><div><Inbox className="nvb-link-icon" /></div> <span className="nvb-link-text" >Inbox</span></div>
            <div className={this.props.page == 'calendar' ? "navbar-nav-link active" : "navbar-nav-link"} style={{ paddingLeft: '40px', display: 'inline-flex' }} onClick={() => { this.navigate('/dashboard/calendar') }}><div><Calendar className="nvb-link-icon" /></div> <span className="nvb-link-text" >Calendar</span></div>

          </div>
          <div className="navbar-right" style={{ display: 'inline-flex' }}>


            <Egg icon={<Bell style={{ color: '#484848', width: '100%', height: '100%' }} />}><Notifications /></Egg>
            <Egg icon={<MessageCircle style={{ color: '#484848', width: '100%', height: '100%' }} />}><InboxP showContactsOnly={true} /></Egg>

            <AvatarDropDown account_name={this.state.account_name} />
          </div>
        </div>
      );
    } else if (this.props.type == 'minimal') {
      return (
        <div className="navbar" style={this.props.style}>
          <div className="navbar-brand">
            <Link to="/"><img src={brandIcon} height="32px" /></Link>
          </div>

        </div>
      );
    } else {
      return (
        <div className="navbar" style={this.props.style}>
          <div style={{ margin: 'auto', marginLeft: '0px' }} className="nvb-toggle-button" >
            <Button onClick={this.handleToggleSandwich} variant="transparent" buttonCenterIcon={this.state.sandwichToggled == false ? <Menu style={{ width: '100%', height: '100%' }} /> : <X style={{ width: '100%', height: '100%' }} />} />
          </div>
          <div className="navbar-brand">
            <Link to="/"><img src={brandIcon} height="32px" /></Link>
          </div>
          <div className="navbar-nav">

            {(this.props.showSearch == true) ?
              <Textbox style={{ width: '500px' }} placeholder="Search.." button={<Button variant="primary" innerPadding='6px' buttonCenterIcon={<Search style={{ width: '100%', height: '100%' }} />} style={{ width: '30px', height: '30px' }} />} /> : <div style={{ display: 'inline-flex' }}>
                <div className={this.props.page == 'Home' ? "navbar-nav-link active" : "navbar-nav-link"}><Link to="/" style={{ color: 'unset' }}>Home</Link></div>
                <div className={this.props.page == 'Explorer' ? "navbar-nav-link active" : "navbar-nav-link"}><Link to="/explorer/*/*/*" style={{ color: 'unset' }}>Explore</Link></div>
                <div className={this.props.page == 'Solutions' ? "navbar-nav-link active" : "navbar-nav-link"}><Link to="/solutions/" style={{ color: 'unset' }}>Agencies solutions</Link></div>
                <div className={this.props.page == 'About' ? "navbar-nav-link active" : "navbar-nav-link"}><Link to="/about-us/" style={{ color: 'unset' }}>About us</Link></div>
                <div className={this.props.page == 'Contact' ? "navbar-nav-link active" : "navbar-nav-link"}><Link to="/contact-us/" style={{ color: 'unset' }}>Contact us</Link></div></div>
            }


          </div>

          {this.state.user_id ?
            <div className="navbar-right" style={{ display: 'inline-flex' }}>
              <div className="mobile-hidden" >
                <div style={{ display: 'inline-flex' }}>
                  <Egg icon={<Bell style={{ color: '#484848', width: '100%', height: '100%' }} />}><Notifications /></Egg>
                  <Egg icon={<MessageCircle style={{ color: '#484848', width: '100%', height: '100%' }} />}><InboxP showContactsOnly={true} /></Egg>
                </div>
              </div>

              <AvatarDropDown account_name={this.state.account_name} />
            </div>
            :
            <div className="navbar-right">
              <div className="mobile-hidden">
                <a onClick={() => this.openModal(<LoginForm />)}><img src={userIcon} style={{ marginRight: '5px' }} /> Log in / Sign up</a>
                <Button onClick={() => this.openModal(<RegisterMain />)} style={{ marginLeft: '20px' }} variant="curvy" value="Become a host" />
              </div>
              <div className="mobile-login-button">
                <Button onClick={() => this.openModal(<LoginForm />)} buttonCenterIcon={<User style={{ width: '100%', height: '100%' }} />} variant="transparent curvy" />
              </div>
            </div>
          }
          <Modal open={this.state.modalOpen} onClose={this.closeModal} center >
            <div style={{ boxSizing: 'border-box', padding: '15px' }}>
              {this.state.modalContent}
            </div>
          </Modal>
          <Sandwich page={this.props.page} toggled={this.state.sandwichToggled} handleToggleSandwich={this.handleToggleSandwich} />

        </div>
      );
    }
  }
}

class Sandwich extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ zIndex: '4', position: 'fixed', display: this.props.toggled ? 'block' : 'none', width: '100%', height: '100%', left: '0px', backgroundColor: '#00000059', top: '80px' }}  >
        <div style={{ zIndex: '4', position: 'fixed', width: this.props.toggled ? '75%' : '0px', height: '100%', left: '0px', backgroundColor: 'white', top: '80px', borderTop: '1px solid whitesmoke' }}>

          <div style={{ width: '100%', boxSizing: 'border-box', paddingTop: '20px' }}>
            
                <div className={this.props.page == 'Home' ? "navbar-nav-link-mob active" : "navbar-nav-link-mob"}><Link to="/" style={{ color: 'unset' }}>Home</Link></div>
                <div className={this.props.page == 'Explorer' ? "navbar-nav-link-mob active" : "navbar-nav-link-mob"}><Link to="/explorer/*/*/*" style={{ color: 'unset' }}>Explore</Link></div>
                <div className={this.props.page == 'Solutions' ? "navbar-nav-link-mob active" : "navbar-nav-link-mob"}><Link to="/solutions/" style={{ color: 'unset' }}>Agencies solutions</Link></div>
                <div className={this.props.page == 'About' ? "navbar-nav-link-mob active" : "navbar-nav-link-mob"}><Link to="/about-us/" style={{ color: 'unset' }}>About us</Link></div>
                <div className={this.props.page == 'Contact' ? "navbar-nav-link-mob active" : "navbar-nav-link-mob"}><Link to="/contact-us/" style={{ color: 'unset' }}>Contact us</Link></div>
            
          </div>


        </div>
      </div>


    );
  }
}

class MNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sandwichToggled: false }
    this.handleToggleSandwich = this.handleToggleSandwich.bind(this);
  }
  handleToggleSandwich() {
    this.setState({ sandwichToggled: !this.state.sandwichToggled });
  }

  render() {
    return (
      <div>
        <div className="navbar" style={this.props.style}>
          <Button onClick={this.handleToggleSandwich} variant="transparent" style={{ margin: 'auto', marginLeft: '0px' }} buttonCenterIcon={this.state.sandwichToggled == false ? <Menu style={{ width: '100%', height: '100%' }} /> : <X style={{ width: '100%', height: '100%' }} />} />
          <img src={brandIcon} style={{ margin: 'auto', height: '30px' }} />
          <div style={{ margin: 'auto', marginRight: '0px' }}>
            <Avatar dim="50px" filename={cookies.load('user_id') + '.jpg'} />
          </div>
        </div>
        <Sandwich toggled={this.state.sandwichToggled} handleToggleSandwich={this.handleToggleSandwich} />
      </div>

    );
  }
}




export { Navbar };