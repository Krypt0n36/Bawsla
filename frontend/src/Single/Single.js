import React from 'react';
import './single.css';
import { Navbar } from './../Navbar/Navbar';
import { Button } from '../Buttons/Buttons';
import Footer from './../Footer/Footer';
// icons
import heartIcon from './icons/heart.svg';
import shareIcon from './icons/share.svg';
import printIcon from './icons/print.svg';
import tickIcon from './icons/tick.svg';
import chatIcon from './icons/chat.svg';
import phoneIcon from './icons/phone.svg';
import starsIcon from './icons/review-stars.svg'
import { DropDown, TextArea } from '../Textbox/Textbox';
import { Link, withRouter } from "react-router-dom";
import NextIcon from './../Card/next-arrow.svg';
import PrevIcon from './../Card/prev-arrow.svg';
import cookies from 'react-cookies';
import { Avatar } from '../Avatar/Avatar';
import { Heart, MessageCircle, Phone, Printer, Share, Star } from 'react-feather';
import { Map } from './../Map/Map';
import Inbox from '../Inbox/Inbox';
import { Card } from '../Card/Card';
import globals from './../var';


class StarBarDynamic extends React.Component {
    constructor(props) {
        super(props)
        this.state = { arr: [0, 0, 0, 0, 0, 0], value: this.props.value || 0 }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(index) {
        this.setState({ value: index + 1 }, () => {
            this.props.onChange({ target: { name: 'rating', value: this.state.value } });
        })
    }
    render() {
        return (
            <div>
                {this.state.arr.map((item, index) => <Star onClick={() => this.handleClick(index)} style={{ strokeWidth: 0, fill: (index >= this.state.value) ? '#d0d0d0' : 'orange', marginRight: '0px', height: this.props.dim || '15px', width: this.props.dim || '15px', }} />)}
            </div>
        );
    }
}

class StarBarStatic extends React.Component {
    constructor(props) {
        super(props)
        this.state = { arr: [0, 0, 0, 0, 0, 0] }

    }
    render() {
        return (
            <div>
                {this.state.arr.map((item, index) => <Star style={{ strokeWidth: 0, fill: (index >= this.props.value) ? '#d0d0d0' : 'orange', marginRight: '0px', height: this.props.dim || '15px', width: this.props.dim || '15px', }} />)}
            </div>
        );
    }
}


class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentImage: 0 }
        this.handleNextImage = this.handleNextImage.bind(this);
        this.handlePrevImage = this.handlePrevImage.bind(this);
    }
    handleNextImage() {
        if (this.state.currentImage == this.props.pics.length - 1) {
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
            this.setState({ currentImage: this.props.pics.length - 1 });
        }
        else {
            this.setState({ currentImage: this.state.currentImage - 1 });
        }
    }
    render() {
        return (
            <div className="gallery-container">
                <div className="gallery-main-frame-container">
                    <div className="gallery-main-frame" style={{ backgroundImage: `url('${globals.cdn_url}/listings-images/${this.props.pics[this.state.currentImage].filename}')` }}>
                        <div className="slider-control-container">
                            <div className="slider-control prev-button" onClick={this.handlePrevImage}>
                                <img src={PrevIcon} />
                            </div>
                            <div className="slider-control next-button" onClick={this.handleNextImage}>
                                <img src={NextIcon} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gallery-other-frame-container">
                    <div className="gallery-other-frame first" style={{ backgroundImage: `url('${globals.cdn_url}/listings-images/${this.props.pics[this.state.currentImage % this.props.pics.length].filename}')` }}></div>
                    <div className="gallery-other-frame" style={{ backgroundImage: `url('${globals.cdn_url}/listings-images/${this.props.pics[(this.state.currentImage + 1) % this.props.pics.length].filename}')` }}></div>
                    <div className="gallery-other-frame last" style={{ backgroundImage: `url('${globals.cdn_url}/listings-images/${this.props.pics[(this.state.currentImage + 2) % this.props.pics.length].filename}')` }}>
                        <div className="gallery-other-frame-overlay">
                            <span><h2 style={{ margin: '0px' }}>{this.props.pics.length - 2}</h2> <br></br>Other pictures  </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
class Well extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="well" style={this.props.style}>
                {this.props.title && this.props.title}
                {this.props.children}
            </div>
        );
    }
}

class Review extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="review-container">
                <div className="review-avatar-container">
                    <div className="review-avatar">
                    </div>
                </div>
                <div className="review-info" style={{width:'inherit'}}>
                    <div style={{ display: 'inline-flex', width: '100%', lineHeight:2 }}><h3 className="review-name">Hassen Belani</h3><div style={{lineHeight:2.5}}><StarBarStatic value={this.props.data.rating} dim={"15px"} /></div><span className="review-date" style={{margin:'auto', marginRight:'0px'}}>Today</span></div>
                    <span style={{color:'#5f5f5f'}}>{this.props.data.body}</span>
                </div>
            </div>
        );
    }
}

class Pagination extends React.Component{
    constructor(props){
        super(props);
        this.state = {value:this.props.value, over:this.props.over, arr:[]}

    }


    
    componentDidMount(){
        var arr = [];
        for(var i=0; i<this.props.over; i++){
            if(i == this.props.value){
                arr.push(1)

            }else{
                arr.push(0)

            }

        }
        this.setState({arr:arr}, ()=>{
            console.log(this.state.arr)
        });
    }
    
    render(){
        return (
            <div style={{display:'inline-flex', margin:'auto'}}>
                {this.state.arr.map((item, index) => <div style={{width:'5px', height:'5px',marginRight:'2px', marginLeft:'2px',  borderRadius:'30px', backgroundColor:(item==1)&&'#EBEBEB', border:'3px solid #EBEBEB'}} onClick={() => {this.props.handleMove(index)}}></div>)}
            </div>
        );
    }
}
class AccountCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="account-card-container">
                <div className="account-card-container-container">
                    <Avatar dim='80px' filename='avatar-01.jpg' />
                </div>
                <div className="account-card-info" >
                    <div style={{ padding: '15px 10px 0px 10px' }}>
                        <h4 style={{ color: 'black' }}>Hassen Belani</h4>
                        <span>Broker</span>

                    </div>
                </div>
                <Button variant="" innerPadding="15px" buttonCenterIcon={<Phone style={{ width: '100%', height: '100%', strokeWidth: '1.4' }} />} style={{ backgroundColor: '', border: 'none', width: '50px', margin: 'auto', marginRight: '2px', float: 'right' }} />
                <Button variant="" innerPadding="15px" buttonCenterIcon={<MessageCircle style={{ width: '100%', height: '100%', strokeWidth: '1.4' }} />} style={{ backgroundColor: '', border: 'none', marginRight: '0px', width: '50px', margin: 'auto', float: 'right' }} />
            </div>
        );
    }
}

export default class Single extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: { images: [{ filename: null }], eq_fea: '' }, propDetails: [], reviews: [], marker: 3, landlord_cards:[],landlord_cards_current:0 }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmitReview = this.handleSubmitReview.bind(this)
        this.handleLoadMore = this.handleLoadMore.bind(this)
        this.fetchReviews = this.fetchReviews.bind(this)
        this.handleMove = this.handleMove.bind(this);
        this.navigate = this.navigate.bind(this)
    }
    navigate(e, link){
        try{
            e.preventDefault()

        }
        catch{

        }
        window.location = link;
    }
    fetchReviews() {
        const id = this.state.prop_id;
        fetch(`${globals.backend_url}/api/reviews/fetch?post_id=${id}&marker=${this.state.marker}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    this.setState({ reviews: resp.data });
                    console.log(resp);
                }
            })
    }
    handleChange(event) {
        try {
            event.preventDefault();
        } catch {

        }
        console.log(event.target.name + ' = ' + event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        const city = this.props.match.params.city;
        const region = this.props.match.params.region;
        this.fetchData(id);
    }
    handleSubmitReview() {
        const data = new FormData();
        data.append('rating', this.state.rating);
        data.append('body', this.state.review_body);
        data.append('post_id', this.state.prop_id);
        data.append('identifier', cookies.load('user_id'));
        data.append('session_token', cookies.load('session_token'));
        fetch(`${globals.backend_url}/api/reviews/add`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then((resp) => {
                if (resp.status != 'ok') {
                    alert('error adding review, check console')
                    console.log(resp)
                } else {
                    this.setState({ rating: 0, body: '' })
                }
            })
    }
    translate(field_name) {
        if (field_name == 'dtl_indp_entry') {
            return 'Independant entry'
        }
        else if (field_name == 'dtl_year_built') {
            return 'Year built'
        }
        else if (field_name == 'dtl_parking_place') {
            return 'Parking place'
        }

    }
    fetchData = id => {
        this.setState({ prop_id: id })
        fetch(`${globals.backend_url}/api/single/fetch?id=${id}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {

                    this.setState({ data: resp.data }, () => {
                        console.log(this.state.data)
                        var dtl_arr = [];
                        for (var key in this.state.data) {
                            if (this.state.data.hasOwnProperty(key)) {
                                if (key.includes('dtl_')) {
                                    dtl_arr.push([key, this.state.data[key]])
                                }
                            }
                        }
                        this.setState({ propDetails: dtl_arr });
                        // fetch reviews
                        this.fetchReviews()
                        // Pull listings of the landlord
                        fetch(`${globals.backend_url}/api/listing/fetch?owner_id=${cookies.load('user_id')}`)
                            .then(resp => resp.json())
                            .then((result) => {
                                this.setState({ landlord_cards: result['data'] }, () => {
                                    //console.log(this.state.cards)
                                });
                            })
                        // FA
                        const data = new FormData();
                        data.append('action', 'click')
                        data.append('asset_id', id)
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
                            })
                    });
                } else {
                    console.log(resp)
                    alert('Listing not found');
                    //window.location = '/'
                }
            })
    };

    handleLoadMore() {
        this.setState({ marker: this.state.marker + 3 }, () => {
            this.fetchReviews();
        })

    }
    handleMove(index){
        this.setState({landlord_cards_current:index}, ()=>{
        });
    }
    render() {
        return (
            <div>
                <Navbar showSearch={true} />
                <Gallery pics={this.state.data.images} />
                <div id="container" style={{ paddingLeft: '30px', paddingRight: '30px', boxSizing: 'border-box' }}>
                    <div id="info-prop-container" style={{ display: 'inline-flex', width: '100%', marginTop: '30px', marginBottom: '35px' }}>
                        <div id="info-prop-details" >
                            <h2 style={{ margin: '0px' }}>{this.state.data['prop_title']}</h2>
                            <span style={{ color: '#ACACAC' }}>{this.state.data['location_city']}, {this.state.data['location_region']}</span>
                        </div>
                        <div id="info-prop-price" style={{ margin: 'auto', display: 'inline-flex', textAlign: 'center' }}>
                            <h2 style={{ margin: '0px' }}>{this.state.data['prop_price']} TND</h2><span style={{ color: '#ACACAC', lineHeight: '2.0', marginLeft: '5px' }}>/ Month</span>
                        </div>
                        <div id="info-prop-icons" style={{ margin: 'auto', marginRight: '0px' }}>
                            <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<Printer style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                            <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<Share style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                            <Button variant="transparent" innerPadding="15px" buttonCenterIcon={<Heart style={{ height: '100%', width: '100%', strokeWidth: 1.4 }} />} />
                        </div>
                    </div>
                </div>
                <div id="container" style={{ width: '100%', backgroundColor: '#F6F6F6', padding: '30px', marginTop: '0px', display: 'inline-flex', boxSizing: 'border-box' }}>
                    <div id="first-col" style={{ width: '70%', boxSizing: 'border-box', paddingRight: '10px' }}>
                        <Well title={<h2>Description</h2>}>
                            <span>
                                {this.state.data['prop_desc']}
                            </span>
                            <hr style={{ marginTop: '30px', marginBottom: '30px', opacity: '0.1' }}></hr>
                            <h2>Property details</h2>
                            <div style={{ display: 'inline-flex', width: '100%' }}>
                                <div style={{ width: '33.33%' }}>
                                    <table>
                                        {this.state.propDetails.map(item => <tr><td>{this.translate(item[0])} :</td><td style={{ fontWeight: 'bold' }}>{item[1]}</td></tr>)}
                                    </table>
                                </div>

                            </div>

                            <hr style={{ marginTop: '30px', marginBottom: '30px', opacity: '0.1' }}></hr>
                            <h2>Equipment and Futures</h2>
                            <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
                                {this.state.data.eq_fea.split('|').map(item => <div style={{ width: '33.33%', marginBottom: '5px' }}><img src={tickIcon} style={{ marginRight: '10px' }} /> <span>{item}</span></div>)}

                            </div>
                        </Well>
                        <Well style={{ marginTop: '20px' }}>
                            <h2 style={{ margin: '0' }}>Location</h2>
                            <span>Ariana, Centre Urbain Nord</span>
                            <Map style={{ height: '400px', marginTop: '20px' }} />
                        </Well>
                        <Well style={{ marginTop: '20px' }}>
                            <h2 style={{ margin: '0' }}>Customers reviews</h2>
                            <div>
                                {this.state.reviews.map(item => <Review data={item} />)}
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <Button variant="curvy" onClick={this.handleLoadMore} value="Show more" style={{ marginTop: '10px', marginBottom: '10px' }} />
                                </div>
                            </div>
                        </Well>
                        <Well style={{ marginTop: '20px' }}>
                            <h2>Write a review</h2>
                            <span>Rating :</span><br></br>
                            <StarBarDynamic dim="20px" value={this.state.rating} onChange={this.handleChange} />
                            <span>Review body :</span>
                            <TextArea name="review_body" value={this.state.review_body} onChange={this.handleChange} style={{ width: '100%', height: '200px', marginTop: '5px' }} />
                            <Button variant="primary" value="Post" style={{ marginTop: '10px' }} onClick={this.handleSubmitReview} />
                        </Well>
                    </div>
                    <div id="second-col" style={{ width: '30%', boxSizing: 'border-box', paddingLeft: '10px', width: '30%', height: '500px' }}>
                        <Well style={{ textAlign: 'center' }}>
                            <div style={{ width: '100%', height: '140px', borderRadius: '7px', backgroundColor: '#171717', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: '-35px', width: '100%' }}>
                                    <div style={{ margin: 'auto', width: 'min-content' }}>
                                        <Avatar avatarSquare={true} filename={this.state.data.prop_owner + '.jpg'} dim="100px" />
                                    </div>
                                </div>
                            </div>
                            <h2 style={{ marginTop: '40px', color: 'black', marginBottom: '2px' }}>Hassen Belani</h2>
                            <span>Landlord</span>
                            <StarBarStatic value={5} />
                            <div style={{ width: '100%', display: 'inline-flex', marginTop: '20px' }}>
                                <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '5px' }}>
                                    <Link to={`/dashboard/inbox/${this.state.data.prop_owner}`}>
                                        <Button variant="primary" style={{ width: '100%' }} value="Send Message" buttonLeftIcon={<MessageCircle style={{ height: '100%', width: '100%' }} />} />
                                    </Link>
                                </div>
                                <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '5px' }}>
                                    <Button variant="dark" style={{ width: '100%' }} value="Phone Call" buttonLeftIcon={<Phone style={{ height: '100%', width: '100%' }} />} />
                                </div>

                            </div>
                        </Well>

                        {this.state.landlord_cards.length > 0 &&<Well style={{ marginTop: '10px' }}>
                            <h3>Landlord's other stays :</h3>
                            <div style={{ width: '100%' }}>
                                {[this.state.landlord_cards[this.state.landlord_cards_current]].map(item => <div style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}><Card data={item} /></div>)}
                            </div>
                            <div style={{width:'100%', textAlign:'center'}}>
                                <Pagination key={this.state.landlord_cards_current} value={this.state.landlord_cards_current} over={this.state.landlord_cards.length} handleMove={this.handleMove}  />
                            </div>
                            
                        </Well>}
                    </div>
                </div>

                <Footer />
            </div>

        );
    }
}