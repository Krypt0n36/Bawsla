import React from 'react';
import { Navbar } from '../Navbar/Navbar';
import houseDashboardIcon from './../icons/house-dashboard.svg';
import viewsDashboardIcon from './../icons/views-dashboard.svg';
import clickDashboardIcon from './../icons/click-dashboard.svg';
import balanceDashboardIcon from './../icons/balance-dashboard.svg';
import { Card } from '../Card/Card';
import { Button } from '../Buttons/Buttons';
import Footer from '../Footer/Footer';
import HostProp from '../HostProp/HostProp'
import plusCircleWhite from './../icons/plus-circle-white.svg';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import cookies from 'react-cookies';
import { Plus } from 'react-feather';
import globals from './../var'
import './Dashboard.css';
import Loading from '../Loading/Loading';

class Widget extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="widget">
                <div>
                    <span className="widget-title">{this.props.title}</span>
                    <h2 className="widget-value">{this.props.data}</h2>
                </div>
                <div className="widget-icon-container">
                    <img className="widget-icon" src={this.props.icon} />
                </div>
            </div>
        );
    }
}

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalContent: <HostProp />, fetchIsLoading:true, modalOpen: false, cards: [], widgetData: { balance: NaN, clicks: NaN, listings: NaN, views: NaN } };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentWillMount() {
        if (!cookies.load('session_token')) {
            window.location = '/login'
        }
        fetch(`${globals.backend_url}/api/listing/fetch?owner_id=${cookies.load('user_id')}`)
            .then(resp => resp.json())
            .then((result) => {
                this.setState({ cards: result['data'], fetchIsLoading:false }, () => {
                    console.log(this.state.cards)
                });
            })
        fetch(`${globals.backend_url}/api/widgets/fetch?identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
            .then(resp => resp.json())
            .then((res) => {
                if (res.status == 'ok') {
                    this.setState({ widgetData: res.data });
                }
            })
    }
    openModal(compo) {
        this.setState({ modalContent: compo, modalOpen: true });
    }
    closeModal() {
        this.setState({ modalOpen: false });
    }
    render() {
        if (this.props.mobile == true) {
            return (<div style={{ backgroundColor: '#F9FAFC' }}>
                <Navbar mobile={true} style={{position:'fixed', top:'0px', boxShadow:'0px 0px 12px #0000001c'}} />
                <div style={{ padding: '5px', paddingTop: '0px', marginTop: '100px' }}>

                    <div style={{ display: 'inline-flex', width: '100%', flexWrap: 'wrap' }}>
                        <div className="widget-container">
                            <Widget title="Total listings" data={this.state.widgetData.listings} icon={houseDashboardIcon} />
                        </div>
                        <div style={{ width: '50%', padding: '10px', paddingTop: '0px', boxSizing: 'border-box' }}>
                            <Widget title="Total views today" data={this.state.widgetData.views} icon={viewsDashboardIcon} />
                        </div>
                        <div style={{ width: '50%', padding: '10px', paddingTop: '0px', boxSizing: 'border-box' }}>
                            <Widget title="Total clicks today" data={this.state.widgetData.clicks} icon={clickDashboardIcon} />
                        </div>
                        <div style={{ width: '50%', padding: '10px', paddingTop: '0px', boxSizing: 'border-box' }}>
                            <Widget title="Current balance" data={this.state.widgetData.balance} icon={balanceDashboardIcon} />
                        </div>
                    </div>

                    <div>
                        <div style={{ padding: '10px', boxSizing: 'border-box', display: 'inline-flex', width: '100%' }}>
                            <h2 style={{ color: 'black' }}>My assets</h2>
                            <Button variant="primary" value="Host new property" buttonLeftIcon={<Plus style={{ width: '100%', height: '100%' }} />} onClick={() => this.openModal(<HostProp />)} style={{ margin: 'auto', marginRight: '0px' }} />
                        </div>
                        <div style={{ display: 'inline-flex', width: '100%' }}>
                            {this.state.cards.map(item => <div style={{ width: '50%', padding: '5px', boxSizing: 'border-box' }}><Card data={item} /></div>)}
                        </div>
                    </div>

                </div>
            </div>);
        } else {
            return (
                <div style={{ backgroundColor: '#F9FAFC' }}>
                    <Modal open={this.state.modalOpen} onClose={this.closeModal} center >
                        <div style={{ boxSizing: 'border-box' }}>
                            {this.state.modalContent}
                        </div>
                    </Modal>
                    <Navbar type="dashboard" page="dashboard" openModal={this.openModal} />
                    <div className="main">

                        <div className="widgets-container">
                            <div className="widget-container">
                                <Widget title="Total listings" data={this.state.widgetData.listings} icon={houseDashboardIcon} />
                            </div>
                            <div className="widget-container">
                                <Widget title="Total views today" data={this.state.widgetData.views} icon={viewsDashboardIcon} />
                            </div>
                            <div className="widget-container">
                                <Widget title="Total clicks today" data={this.state.widgetData.clicks} icon={clickDashboardIcon} />
                            </div>
                            <div className="widget-container">
                                <Widget title="Current balance" data={this.state.widgetData.balance} icon={balanceDashboardIcon} />
                            </div>

                        </div>


                        <div>
                            <div style={{ padding: '10px', boxSizing: 'border-box', display: 'inline-flex', width: '100%' }}>
                                <h2 style={{ color: 'black' }}>My assets</h2>
                                <Button variant="primary" value="Host new property" buttonLeftIcon={<Plus style={{ width: '100%', height: '100%' }} />} onClick={() => this.openModal(<HostProp closeModal={this.closeModal} />)} style={{ margin: 'auto', marginRight: '0px' }} />
                            </div>
                            <div style={{ display: 'inline-flex', width: '100%', minHeight:'412px', flexWrap:'wrap' }}>
                                {(this.state.fetchIsLoading)?<Loading />:this.state.cards.map((item, index) => <div className="w-50-mob" style={{ width: '25%', padding: (index % 2 == 0) ? '0px 2.5px 0px 0px' : '0px 0px 0px 2.5px',padding:'5px', boxSizing: 'border-box' }}><Card data={item} /></div>)}

                                {(this.state.cards.length==0 && !this.state.fetchIsLoading)&&<h1 style={{color:'#e6e6e6', margin:'auto'}}>You have currently no posted properties.</h1>}

                            </div>
                        </div>

                    </div>
                    <Footer />
                </div>


            );
        }
    }
}