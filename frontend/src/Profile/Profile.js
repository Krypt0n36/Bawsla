import React, { Fragment } from 'react';
import { Camera, Facebook, MapPin, MessageCircle, Phone, PhoneCall, Twitter, Youtube } from 'react-feather';
import { Avatar } from '../Avatar/Avatar';
import { Button, TabButton } from '../Buttons/Buttons';
import { Card } from '../Card/Card';
import Footer from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import Stars from '../Stars/Stars';
import Well from '../Well/Well';
import cookies from 'react-cookies';
import { Map } from './../Map/Map';
import globals from './../var';
import { Link } from 'react-router-dom';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id:undefined, cards: [], activeTab: 'listings' };
        this.activateTab = this.activateTab.bind(this);
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.setState({id:id}, ()=>{
            // fetch owner info
            fetch(`${globals.backend_url}/api/getAccountInfo?identifier=${id}`)
                .then(resp => resp.json())
                .then((result) =>{

                })
            fetch(`${globals.backend_url}/api/listing/fetch?owner_id=${this.state.id}`)
            .then(resp => resp.json())
            .then((result) => {
                this.setState({ cards: result['data'] }, () => {
                    console.log(this.state.cards)
                });
            })
        })
    }

    activateTab(tabID) {
        this.setState({ activeTab: tabID }, ()=>{
        });
    }
    
    render() {
        return (
            <div style={{ backgroundColor: 'rgb(249, 250, 252)' }}>
                <Navbar />
                <div style={{ boxSizing: 'border-box', padding: '25px' }}>
                    <div style={{ height: '330px', width: '100%' }}>
                        <div style={{ width: '100%', height: '250px', backgroundColor: '#221D1D', borderRadius: '7px 7px 0px 0px', position: 'relative' }}>
                            <Button style={{ backgroundColor: 'black', border: 'none', color: 'white', position: 'absolute', right: '20px', bottom: '10px' }} buttonLeftIcon={<Camera style={{ color: 'white', height: '100%', width: '100%' }} />} value="Edit cover" />
                        </div>
                        <div style={{ width: '100%', height: '80px', display: 'inline-flex', background: 'white', borderRadius: '0px 0px 7px 7px', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'inline-flex' }}>
                                <Avatar dim="140px" avatarSquare={true} filename={this.state.id + '.jpg'} />
                                <div style={{ marginLeft: '40px' }}>
                                    <h1 style={{ margin: '0px', color: 'white' }}>Hassen Belani</h1>
                                    <div style={{ display: 'inline-flex' }}>
                                        <span style={{ color: '#BCBCBC', fontSize: '17px', marginRight: '10px' }}>Landlord</span>
                                        <Stars value={5} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'inline-flex', margin: 'auto', marginLeft: '200px', zIndex: '1' }}>
                                <div  onClick={() => this.activateTab('listings')}><TabButton value="Listings" active={this.state.activeTab=='listings'} /></div>
                                <div  onClick={() => this.activateTab('reviews')}><TabButton value="Reviews" active={this.state.activeTab=='reviews'} /></div>
                                <div  onClick={() => this.activateTab('about')}><TabButton value="About" active={this.state.activeTab=='about'} /></div>
                            </div>
                            <div style={{ display: 'inline-flex', margin: 'auto', marginRight: '20px' }}>
                                <Link target="_blank" to={`/dashboard/inbox/${this.state.id}`} >
                                <Button variant="primary" value="Send Message" buttonLeftIcon={<MessageCircle style={{ width: '100%', height: '100%' }} />} />
                                </Link>
                            </div>
                        </div>
                    </div>



                    {(this.state.activeTab == 'about') && <div style={{ width: '100%', marginTop: '20px', boxSizing: 'border-box', padding: '20px', backgroundColor: 'white', borderRadius: '7px' }}>
                        <h1 style={{ color: 'black' }}>About</h1>
                        <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
                            <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '10px' }}>
                                <h3>Bio :</h3>
                                <span style={{ fontSize: '14px', color: '#969696' }}>
                                    Evans Tower very high demand corner junior one bedroom plus a large balcony
                                    boasting full open NYC views. You need to see the views to believe them. Mint
                                    condition with new hardwood floors. Lots of closets plus washer and dryer.
                                </span>
                                <h3>Contact :</h3>
                                <span style={{ fontSize: '14px', color: '#969696' }}>
                                    <span><b>Phone number   :</b> 28 077 652</span><br></br>
                                    <span><b>Fix number     :</b> 28 077 652</span><br></br>
                                    <span><b>E-mail address :</b> belani.hassen@gmail.com</span>
                                </span>  
                                <h3>Supplimentary information:</h3>
                                <span style={{ fontSize: '14px', color: '#969696' }}>
                                    <span><b>Join date  :</b> 23/07/2020</span><br></br>
                                    <span><b>Residency     :</b> Tunis</span><br></br>
                                </span>                                
                            </div>
                            <div style={{ width: '50%', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                <h3 style={{ marginBottom: '5px' }}>Agency location :</h3>
                                <Map style={{ width: '100%', height: '300px', marginTop: '20px' }} />
                            </div>

                        </div>

                    </div>}
                    {this.state.activeTab=='listings'&&<div style={{ width: '100%', display: 'inline-flex', marginTop: '20px',boxSizing: 'border-box'}}>
                        <div style={{ display: 'inline-flex', width: '100%' }}>
                            {this.state.cards.map(item => <div style={{ width: '25%', padding: '5px', boxSizing: 'border-box' }}><Card data={item} /></div>)}
                        </div>
                    </div>}

                </div>





                <Footer />
            </div>
        );
    }
}