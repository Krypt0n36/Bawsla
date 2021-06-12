import React from 'react';
import { Button } from '../Buttons/Buttons';
import './card.css';
import editIcon from './../icons/card-icon-edit.svg';
import trashIcon from './../icons/card-icon-trash.svg';
import promoteIcon from './../icons/card-icon-promote.svg';
import NextIcon from './next-arrow.svg';
import PrevIcon from './prev-arrow.svg';
import { Avatar } from './../Avatar/Avatar';
import heartIcon from './../Single/icons/heart.svg';

import indicatorViewsIcon from './../icons/indicator-views.svg';
import indicatorClicksIcon from './../icons/indicator-click.svg';
import cookies from 'react-cookies';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Edit, Edit2, Heart, Trash, TrendingDown, TrendingUp } from 'react-feather';
import globals from './../var';



class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentImage: 0, wished: false };
    this.handleNextImage = this.handleNextImage.bind(this);
    this.handlePrevImage = this.handlePrevImage.bind(this);
    this.toggleToWishlist = this.toggleToWishlist.bind(this)
  }
  toggleToWishlist() {
    const data = new FormData();
    data.append('idfa', cookies.load('idfa'));
    data.append('pid', this.props.data.id);
    fetch(`${globals.backend_url}/api/wish/toggle`, {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then((resp) => {
        if (resp.status == 'ok') {
          this.setState({ wished: !this.state.wished })
        }
      })
  }
  handleNextImage() {
    if (this.state.currentImage == this.props.data.images.length - 1) {
      // last image
      this.setState({ currentImage: 0 });
    }
    else {
      this.setState({ currentImage: this.state.currentImage + 1 });
    }
  }
  handlePrevImage() {
    if (this.state.currentImage == 0) {
      // first image
      this.setState({ currentImage: this.props.data.images.length - 1 });
    }
    else {
      this.setState({ currentImage: this.state.currentImage - 1 });
    }
  }
  componentDidMount() {
    // FA
    const data = new FormData();
    data.append('action', 'view')
    data.append('asset_id', this.props.data.id)
    if (cookies.load('idfa')) {
      data.append('idfa', cookies.load('idfa'))
    }
    fetch(`${globals.backend_url}/api/fa/capture_behaviour`, {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then((resp) => {
        if (resp.status == 'ok') {
          cookies.save('idfa', resp['idfa'], { path: '/' });
        }
        // CHECK IF IN WISHLIST
        fetch(`${globals.backend_url}/api/wish/exist?idfa=${cookies.load('idfa')}&pid=${this.props.data.id}`)
          .then(res => res.json())
          .then((resp) => {
            if (resp.status == 'ok') {
              this.setState({ wished: resp.exist == 'yes' })
            }
          })
      })

  }

  render() {
    let prop_type_value = 'Apartment';
    if (this.props.data.prop_type == '0') {
      prop_type_value = 'Duplex'
    } else if (this.props.data.prop_type == '1') {
      prop_type_value = 'Apartment'
    }else if (this.props.data.prop_type == '2') {
      prop_type_value = 'Studio'
    }else if (this.props.data.prop_type == '3') {
      prop_type_value = 'House'
    }
    
    if (this.props.extended == true) {
      return (
        <div className="card" style={{ width: '100%', display: 'inline-flex' }}>
          <div className="imageFrameEx" style={{ backgroundImage: `url('${globals.frontend_url}/static/uploads/${this.props.data.images[this.state.currentImage].filename}')` }}>
            <div className="imageFrame-overlay" style={{ boxSizing: 'border-box', padding: '10px' }}>
              <div className="slider-control-container">
                <div className="slider-control prev-button" onClick={this.handlePrevImage}>
                  <img src={PrevIcon} />
                </div>
                <div className="slider-control next-button" onClick={this.handleNextImage}>
                  <img src={NextIcon} />
                </div>
              </div>
              <div className="card-price"><h2 style={{ margin: '0px' }}>{this.props.data.prop_price} TND</h2><span style={{ lineHeight: '2' }}>/Month</span> </div>
            </div>
          </div>
          <div style={{ width: '50%', boxSizing: 'border-box', paddingLeft: '20px ' }}>
            <div className="row1" style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span><span className="prop-type">Apartement</span> · <span className="prop-date">Today</span></span>
            </div>
            <div onClick={alert('one click')} onDoubleClick={alert('double click')}>
              <h3 className="prop_title">{this.props.data.prop_title}</h3>

            </div>

            <span style={{ color: '#6E6E6E' }}>{this.props.data.location_city + ', ' + this.props.data.location_region}</span>

            <div style={{ display: 'inline-flex', width: '100%', marginTop: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div className="pill">S+{this.props.data.prop_piece}</div>
              <div className="pill">Furnished</div>
              <div className="pill">Residence</div>
            </div>

            <div style={{ width: '100%', display: 'inline-flex' }}>

              <Avatar dim='40px' filename='avatar-01.jpg' />
              <div className="card-owner-creds">
                <span className="name">{this.props.data.owner.account_name}</span><br></br>
                <span className="role">Broker</span>
              </div>
            </div>

          </div>
        </div>
      );
    } else {
      return (
        <div className="card">
          <div className="imageFrame" style={{ backgroundImage: `url('${globals.backend_url}/static/uploads/${this.props.data.images[this.state.currentImage].filename}')` }}>

            <div className="imageFrame-overlay" style={{ boxSizing: 'border-box', padding: '10px' }}>
              <div style={{
                display: 'none',
                width: 'fit-content',
                fontSize: '12px',
                padding: '5px 15px',
                background: '#000000b8',
                color: '#ffffffdb',
                borderRadius: '30px',
                margin: 'auto',
                marginRight: '0px'
              }}>Available 23 July 2021</div>

              <div className="slider-control-container">
                <div className="slider-control prev-button" onClick={this.handlePrevImage}>
                  <img src={PrevIcon} />
                </div>
                <div className="slider-control next-button" onClick={this.handleNextImage}>
                  <img src={NextIcon} />
                </div>
              </div>
              <div className="card-price"><h2 style={{ margin: '0px' }}>{this.props.data.prop_price} TND</h2><span style={{ lineHeight: '2' }}>/Month</span> </div>
            </div>
          </div>
          <div className="row1" style={{ marginTop: '10px', marginBottom: '10px' }}>
            <span><span className="prop-type">{prop_type_value}</span> · <span className="prop-date">{this.props.data.post_date}</span></span>
          </div>
          <Link target="_blank" to={`/single/${this.props.data.id}`} ><h3 className="prop_title">{this.props.data.prop_title}</h3></Link>

          <span className="card_location">{this.props.data.location_city + ', ' + this.props.data.location_region}</span>

          <div style={{ display: 'inline-flex', width: '100%', marginTop: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <div className="pill">S+{this.props.data.prop_piece}</div>
            <div className="pill">Furnished</div>
            <div className="pill">Residence</div>
          </div>

          {(this.props.data.prop_owner == cookies.load('user_id')) ?
            <div style={{ width: '100%', display: 'inline-flex' }}>

              <div style={{ display: 'inline-flex' }}>
                <Indicator icon={indicatorViewsIcon} value={this.props.data.nbr_views} />
                <Indicator icon={indicatorClicksIcon} value={this.props.data.nbr_clicks} />
              </div>
              <div style={{ margin: 'auto', marginRight: '0px' }}>

                <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<TrendingUp style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<Trash style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                <Link to={`/asset/control/${this.props.data.id}`}>
                  <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<Edit2 style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                </Link>
              </div>
            </div>
            :
            <div style={{ width: '100%', display: 'inline-flex' }} className="mobile-hidden">
              <Avatar dim='40px' filename={this.props.data.prop_owner + '.jpg'} />
              <div className="card-owner-creds">
                <Link target="_blank" to={`/profile/${this.props.data.prop_owner}`}><span className="name">{this.props.data.owner.account_name}</span></Link><br></br>
                <span className="role">Broker</span>
              </div>
              <Button onClick={this.toggleToWishlist} variant="curvy transparent" innerPadding="10px" style={{ width: '40px', height: '40px', margin: 'auto', marginRight: '0px' }} buttonCenterIcon={<Heart style={{ width: '100%', height: '100%', fill: (this.state.wished == true) && 'red', color: (this.state.wished == true) && 'red' }} />} />
            </div>


          }


        </div>
      );
    }
  }
}



class Indicator extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="indicator-container">
        <div className="indicator-icon">
          <img src={this.props.icon} />
        </div>
        <div className="indicator-value">
          <span>{this.props.value}</span>
        </div>
      </div>
    );
  }
}
class Card2 extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="imageFrame">
          <div className="imageFrame-overlay" style={{ boxSizing: 'border-box', padding: '10px' }}>
            <div className="pill" style={{ backgroundColor: '#FD5A5F', color: 'white' }}>Furnished</div>

            <div className="card-price"><h2 style={{ margin: '0px' }}>650 TND</h2><span style={{ lineHeight: '2' }}>/Month</span> </div>
          </div>
        </div>
        <div className="row1" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span><span className="prop-type">Apartement</span> · <span className="prop-date">Today</span></span>
        </div>
        <h3>Renovated Apartement</h3>
        <span style={{ color: '#6E6E6E' }}>Centre Urbain Nord</span>

        <div style={{ display: 'inline-flex', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
          <div className="pill">S+3</div>
          <div className="pill">Furnished</div>
          <div className="pill">Residence</div>
        </div>

        <div style={{ width: '100%', display: 'inline-flex' }}>
          <div style={{ display: 'inline-flex' }}>
            <Indicator icon={indicatorViewsIcon} value={332} />
            <Indicator icon={indicatorClicksIcon} value={231} />
          </div>
          <div style={{ margin: 'auto', marginRight: '0px' }}>
            <Button variant="square" buttonCenterIcon={promoteIcon} style={{ width: '40px', height: '40px', backgroundColor: '#86EABC', color: '#232E43', border: 'none', marginRight: '5px' }} />
            <Button variant="square" buttonCenterIcon={trashIcon} style={{ width: '40px', height: '40px', backgroundColor: '#B5B9C0', color: '#FD5A5F', border: 'none', marginRight: '5px' }} />
            <Button variant="square" buttonCenterIcon={editIcon} style={{ width: '40px', height: '40px', backgroundColor: '#FEC6C8', color: '#FD5A5F', border: 'none' }} />
          </div>
        </div>


      </div>
    );
  }
}

export { Card, Card2 };