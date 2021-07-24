import React from 'react';
import { Navbar } from './Navbar/Navbar';
import { Card } from './Card/Card';
import { Button } from './Buttons/Buttons';
import LandingPicure from './LandingPicture/LandingPicture'
import { Textbox, DropDown } from './Textbox/Textbox';
import './global.css';
//import Well from './Well/Well';
import gridIcon from './icons/grid.svg';
import listingIcon from './icons/listing.svg';
import { SearchPanelSelect } from './SearchPanel/SearchPanel';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Footer from './Footer/Footer';
import GoogleMapReact from 'google-map-react';
import { ArrowDownCircle, Filter, Grid, List, Map, MapPin } from 'react-feather';
import Loading from './Loading/Loading';
import globals from './var';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class MapCD extends React.Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAYjbLKsiiX6V7JETtHARWyTk9j2yFLwyA', mapId: '2ec253de775e93bf' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}

        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}


export default class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchCity: '', searchRegion: '', cards: [] };
  }

  componentWillMount() {
    this.setState({ searchCity: this.props.match.params.city, searchRegion: this.props.match.params.region, searchType: this.props.match.params.type }, () => {
      fetch(`${globals.backend_url}/api/listing/fetch?city=${this.state.searchCity}&region=${this.state.searchRegion}&prop_type=${this.state.searchType}`)
        .then(resp => resp.json())
        .then((result) => {
          this.setState({ cards: result['data'] }, () => {
            console.log(this.state.cards)
          });
        })
    });


  }
  render() {
    return (
      <div style={{ backgroundColor: 'rgb(249, 250, 252)', position: 'absolute', width: '100%', minHeight: '100%', }}>
        <Navbar showSearch={true} page="Explorer" style={{ border: '1px solid #EBEBEB!important' }} />
        <div style={{boxSizing:'border-box', padding:'25px', paddingBottom:'0px'}}>
          <div style={{ paddingLeft:'15px', marginTop:'30px'}}>
            <h2 style={{ color: 'black', margin: '0px' }}>{this.state.cards.length} search results in <span style={{ color: '#EF3D49' }}>{this.state.searchCity}, {this.state.searchRegion}</span></h2>
          </div>
          <SearchPanelSelect style={{ backgroundColor: 'transparent', width: '100%' }}  />
        </div>
        <div style={{boxSizing:'border-box', padding:'25px', paddingTop:'0px'}}>
          <div style={{width:'100%', boxSizing:'border-box', padding:'10px', display:'inline-flex'}}>
            <Button variant="transparent" value="Grid" buttonLeftIcon={<Grid style={{height:'100%', width:'100%'}} />} />
            <Button variant="transparent" value="List" buttonLeftIcon={<List style={{height:'100%', width:'100%'}} />} />
            <Button variant="transparent" value="Map" buttonLeftIcon={<Map style={{height:'100%', width:'100%'}} />} />
            <div style={{margin:'auto', marginRight:'0px'}}>
            <Button  variant="transparent" value="Filter" buttonLeftIcon={<Filter style={{height:'100%', width:'100%'}} />} />
            <Button  variant="transparent" value="Sort" buttonLeftIcon={<ArrowDownCircle style={{height:'100%', width:'100%'}} />} />
          
            </div>
            
          </div>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap',  marginBottom: '10px', width: '100%', boxSizing: 'border-box', padding: '10px' }}>
            <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
              {(this.state.cards.length > 0) ? this.state.cards.map((item, index) => <div className="w-50-mob" style={{ width: '25%', padding: (index % 2 == 0) ? '0px 2.5px 0px 0px' : '0px 0px 0px 2.5px', padding: '5px', boxSizing: 'border-box' }}><Card data={item} /></div>) : <Loading height="450px" />}

            </div>
          </div>


        </div>

        <Footer />
      </div>
    );
  }
}